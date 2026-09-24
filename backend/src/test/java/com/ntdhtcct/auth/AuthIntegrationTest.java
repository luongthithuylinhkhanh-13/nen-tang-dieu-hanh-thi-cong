package com.ntdhtcct.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntdhtcct.auth.dto.LoginRequest;
import com.ntdhtcct.auth.entity.Role;
import com.ntdhtcct.auth.entity.User;
import com.ntdhtcct.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.ActiveProfiles;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Tự động rollback database sau mỗi bài test
@ActiveProfiles("test")
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Tạo sẵn 1 user mẫu trước mỗi bài test
        User testUser = User.builder()
                .username("testuser")
                .password(passwordEncoder.encode("password123"))
                .role(Role.ROLE_USER)
                .build();
        userRepository.save(testUser);
    }

    // T-08.7 - Viết Integration Test Login
    @Test
    void testLogin_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    void testLogin_Failure_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Mặc định Spring Security ném 403 Forbidden khi có lỗi BadCredentialsException (chưa có custom exception handler)
    }

    // T-08.8 - Viết Integration Test Authorization
    @Test
    void testAuthorization_AccessWithoutToken_ShouldFail() throws Exception {
        // Cố tình gọi một API cần xác thực mà không truyền Token
        // Ở đây ta gọi bừa 1 API /api/users, SecurityConfig mặc định chặn tất cả ngoài /api/auth/**
        mockMvc.perform(get("/api/some-protected-data"))
                .andExpect(status().isForbidden()); // Hoặc 401 Unauthorized tùy cấu hình Spring
    }
}
