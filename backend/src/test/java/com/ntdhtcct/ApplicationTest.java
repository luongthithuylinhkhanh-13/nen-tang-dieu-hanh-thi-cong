package com.ntdhtcct;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Kiểm tra Spring Boot context load thành công.
 * Yêu cầu PostgreSQL đang chạy và biến môi trường DB_* đã được cấu hình.
 */
@SpringBootTest
@ActiveProfiles("test")
class ApplicationTest {

    @Test
    void contextLoads() {
        // Xác nhận Spring context khởi động không lỗi
    }
}
