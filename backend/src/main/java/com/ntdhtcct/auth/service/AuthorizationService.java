package com.ntdhtcct.auth.service;

import com.ntdhtcct.common.exception.ForbiddenException;
import com.ntdhtcct.common.exception.ResourceNotFoundException;
import com.ntdhtcct.common.exception.UnauthorizedException;
import com.ntdhtcct.repository.ProjectMemberRepository;
import com.ntdhtcct.repository.ProjectRepository;
import com.ntdhtcct.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

/**
 * Service xử lý logic xác thực và phân quyền (RBAC) trên phạm vi dự án.
 * Thực hiện:
 * - T-04.6: Kiểm tra User có thuộc Project hay không
 * - T-04.7: Kiểm tra Role của User
 * - T-04.10: Xử lý lỗi 403 khi không đủ quyền
 * - T-04.11: Kiểm tra truy cập Project không thuộc thành viên
 */
@Service
public class AuthorizationService {

    private static final Logger log = LoggerFactory.getLogger(AuthorizationService.class);

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public AuthorizationService(ProjectRepository projectRepository,
                                UserRepository userRepository,
                                ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    /**
     * Kiểm tra quyền truy cập của người dùng vào dự án cụ thể.
     *
     * @param projectId ID của dự án
     * @param userId ID của người dùng
     * @param requiredRoles Danh sách các vai trò được phép (nếu rỗng, chỉ cần là thành viên dự án)
     * @return Vai trò (role code) của user trong dự án
     */
    public String checkProjectAccess(Long projectId, Long userId, String[] requiredRoles) {
        // 1. Kiểm tra định danh người dùng
        if (userId == null) {
            throw new UnauthorizedException("AUTH_MISSING_USER_ID", "Yêu cầu cung cấp thông tin người dùng (Header X-User-Id)");
        }

        // 2. Kiểm tra sự tồn tại của dự án
        if (projectId != null && !projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("PROJECT_NOT_FOUND", "Không tìm thấy dự án với ID: " + projectId);
        }

        // 3. T-04.6 & T-04.11: Kiểm tra User có thuộc Project hay không
        Optional<String> activeRoleOpt = projectMemberRepository.findActiveRoleCodeByProjectAndUser(projectId, userId);

        if (activeRoleOpt.isEmpty()) {
            log.warn("Truy cập bị từ chối: User {} không thuộc thành viên của Project {}", userId, projectId);
            throw new ForbiddenException("PROJECT_ACCESS_DENIED",
                    "Bạn không phải là thành viên của dự án này [ID=" + projectId + "]. Quyền truy cập bị từ chối.");
        }

        String userRole = activeRoleOpt.get();

        // 4. T-04.7 & T-04.10: Kiểm tra Role của User đối với quyền yêu cầu
        if (requiredRoles != null && requiredRoles.length > 0) {
            boolean hasPermission = false;
            for (String allowedRole : requiredRoles) {
                // Vai trò ADMIN luôn có toàn quyền, hoặc khớp chính xác vai trò
                if ("ADMIN".equalsIgnoreCase(userRole) || allowedRole.trim().equalsIgnoreCase(userRole)) {
                    hasPermission = true;
                    break;
                }
            }

            if (!hasPermission) {
                log.warn("Truy cập bị từ chối: User {} có role [{}] không đủ quyền yêu cầu {} tại Project {}",
                        userId, userRole, Arrays.toString(requiredRoles), projectId);
                throw new ForbiddenException("INSUFFICIENT_PROJECT_ROLE",
                        "Vai trò của bạn [" + userRole + "] không có quyền thực hiện hành động này. Yêu cầu một trong các quyền: "
                                + Arrays.toString(requiredRoles));
            }
        }

        return userRole;
    }
}
