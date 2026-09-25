package com.ntdhtcct.auth.interceptor;

import com.ntdhtcct.auth.annotation.RequireProjectRole;
import com.ntdhtcct.auth.config.RoutePermissionConfig;
import com.ntdhtcct.auth.context.UserSecurityContext;
import com.ntdhtcct.auth.service.AuthorizationService;
import com.ntdhtcct.common.exception.ForbiddenException;
import com.ntdhtcct.common.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;
import java.util.Optional;

/**
 * T-04.5: Middleware Authorization (HandlerInterceptor) kiểm soát mọi yêu cầu truy cập tài nguyên dự án.
 * T-04.6: Kiểm tra User có thuộc Project hay không.
 * T-04.7: Kiểm tra Role của User.
 * T-04.8: Phân quyền theo Annotation @RequireProjectRole hoặc RoutePermissionConfig.
 * T-04.9: Thiết lập cơ chế Default Deny (Mặc định từ chối nếu không có quyền rõ ràng).
 * T-04.10: Xử lý lỗi 403 Forbidden.
 * T-04.11: Kiểm tra truy cập Project không thuộc thành viên.
 */
@Component
public class ProjectAuthorizationInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(ProjectAuthorizationInterceptor.class);

    private final AuthorizationService authorizationService;
    private final RoutePermissionConfig routePermissionConfig;

    public ProjectAuthorizationInterceptor(AuthorizationService authorizationService,
                                          RoutePermissionConfig routePermissionConfig) {
        this.authorizationService = authorizationService;
        this.routePermissionConfig = routePermissionConfig;
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Bỏ qua nếu không phải HandlerMethod (ví dụ: static resources)
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        // Trích xuất projectId từ URI path variable (ví dụ: /api/projects/{projectId}/...)
        Long projectId = extractProjectId(request);

        // Nếu request không thuộc phạm vi dự án (/api/projects/**), cho qua
        if (projectId == null && !request.getRequestURI().startsWith("/api/projects")) {
            return true;
        }

        // Lấy thông tin User hiện tại từ Header X-User-Id
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null || userIdHeader.isBlank()) {
            throw new UnauthorizedException("AUTH_MISSING_USER_ID", "Yêu cầu cung cấp định danh người dùng qua Header X-User-Id");
        }

        Long userId;
        try {
            userId = Long.parseLong(userIdHeader.trim());
        } catch (NumberFormatException e) {
            throw new UnauthorizedException("AUTH_INVALID_USER_ID", "Giá trị Header X-User-Id không hợp lệ: " + userIdHeader);
        }

        // T-04.8 & T-04.9: Xác định quyền yêu cầu và áp dụng cơ chế Default Deny
        String[] requiredRoles = resolveRequiredRoles(handlerMethod, request);

        // T-04.6, T-04.7, T-04.11: Kiểm tra quyền truy cập dự án và vai trò
        String activeRole = authorizationService.checkProjectAccess(projectId, userId, requiredRoles);

        // Lưu thông tin vào Context của request hiện tại
        UserSecurityContext.setUserId(userId);
        UserSecurityContext.setUserProjectRole(activeRole);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // Dọn dẹp ThreadLocal tránh memory leak
        UserSecurityContext.clear();
    }

    /**
     * Trích xuất projectId từ đường dẫn template hoặc tham số.
     */
    @SuppressWarnings("unchecked")
    private Long extractProjectId(HttpServletRequest request) {
        Object uriTemplateVarsObj = request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (uriTemplateVarsObj instanceof Map<?, ?> uriVars) {
            Object projectIdVal = uriVars.get("projectId");
            if (projectIdVal != null) {
                try {
                    return Long.parseLong(projectIdVal.toString());
                } catch (NumberFormatException ignored) {
                }
            }
        }

        // Fallback kiểm tra Header hoặc query parameter
        String headerProjectId = request.getHeader("X-Project-Id");
        if (headerProjectId != null && !headerProjectId.isBlank()) {
            try {
                return Long.parseLong(headerProjectId.trim());
            } catch (NumberFormatException ignored) {
            }
        }

        String paramProjectId = request.getParameter("projectId");
        if (paramProjectId != null && !paramProjectId.isBlank()) {
            try {
                return Long.parseLong(paramProjectId.trim());
            } catch (NumberFormatException ignored) {
            }
        }

        return null;
    }

    /**
     * T-04.8 & T-04.9: Tìm danh sách role yêu cầu theo Annotation hoặc Cấu hình Route.
     * Áp dụng nguyên tắc Default Deny: Nếu không có bất kỳ cấu hình nào, từ chối mặc định!
     */
    private String[] resolveRequiredRoles(HandlerMethod handlerMethod, HttpServletRequest request) {
        // 1. Kiểm tra Annotation @RequireProjectRole trên Method
        RequireProjectRole methodAnnotation = handlerMethod.getMethodAnnotation(RequireProjectRole.class);
        if (methodAnnotation != null) {
            return methodAnnotation.value();
        }

        // 2. Kiểm tra Annotation @RequireProjectRole trên Controller Class
        RequireProjectRole classAnnotation = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), RequireProjectRole.class);
        if (classAnnotation != null) {
            return classAnnotation.value();
        }

        // 3. Kiểm tra RoutePermissionConfig
        Optional<String[]> routeRoles = routePermissionConfig.findRequiredRoles(request.getMethod(), request.getRequestURI());
        if (routeRoles.isPresent()) {
            return routeRoles.get();
        }

        // 4. T-04.9: Cơ chế Default Deny - Không có cấu hình quyền thì TỪ CHỐI MẶC ĐỊNH
        log.warn("Default Deny kích hoạt cho route [{}] {}", request.getMethod(), request.getRequestURI());
        throw new ForbiddenException("DEFAULT_DENY",
                "Cơ chế bảo vệ Default Deny: Tuyến đường [" + request.getMethod() + " " + request.getRequestURI()
                        + "] chưa được cấp phép truy cập công khai. Truy cập bị từ chối mặc định.");
    }
}
