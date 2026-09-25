package com.ntdhtcct.auth.context;

/**
 * Lưu trữ thông tin định danh và vai trò của người dùng hiện tại trong luồng xử lý request.
 */
public final class UserSecurityContext {

    private static final ThreadLocal<Long> CURRENT_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_USER_PROJECT_ROLE = new ThreadLocal<>();

    private UserSecurityContext() {
    }

    public static void setUserId(Long userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static Long getUserId() {
        return CURRENT_USER_ID.get();
    }

    public static void setUserProjectRole(String role) {
        CURRENT_USER_PROJECT_ROLE.set(role);
    }

    public static String getUserProjectRole() {
        return CURRENT_USER_PROJECT_ROLE.get();
    }

    public static void clear() {
        CURRENT_USER_ID.remove();
        CURRENT_USER_PROJECT_ROLE.remove();
    }
}
