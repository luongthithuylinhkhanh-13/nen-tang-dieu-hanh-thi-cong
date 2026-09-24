package com.ntdhtcct.auth;

import com.ntdhtcct.auth.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // Gán giá trị secret key giống như trong file properties (Reflection)
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "thisIsAVeryLongSecretKeyForTestingPurposeOnly12345");
    }

    // T-08.6 - Unit Test Authorization (Kiểm tra token chứa Role)
    @Test
    void testGenerateAndValidateToken() {
        String username = "admin";
        String role = "ROLE_ADMIN";

        // Tạo token
        String token = jwtUtils.generateToken(username, role);
        assertNotNull(token);

        // Kiểm tra tính hợp lệ
        assertTrue(jwtUtils.validateToken(token));

        // Lấy username từ token
        String extractedUsername = jwtUtils.getUsernameFromToken(token);
        assertEquals(username, extractedUsername);
    }

    @Test
    void testValidateToken_InvalidToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.InvalidPayload.InvalidSignature";
        assertFalse(jwtUtils.validateToken(invalidToken));
    }
}
