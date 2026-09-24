package com.ntdhtcct.auth;

import com.ntdhtcct.auth.dto.AuthResponse;
import com.ntdhtcct.auth.dto.LoginRequest;
import com.ntdhtcct.auth.entity.Role;
import com.ntdhtcct.auth.entity.User;
import com.ntdhtcct.auth.repository.UserRepository;
import com.ntdhtcct.auth.security.JwtUtils;
import com.ntdhtcct.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .username("test_user")
                .password("encoded_pass")
                .role(Role.ROLE_USER)
                .build();
    }

    // T-08.5 - Unit Test Authentication (Đăng nhập thành công)
    @Test
    void testLogin_Success() {
        // Mock dữ liệu
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test_user");
        loginRequest.setPassword("raw_pass");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        
        when(userRepository.findByUsername("test_user")).thenReturn(Optional.of(mockUser));
        when(jwtUtils.generateToken("test_user", "ROLE_USER")).thenReturn("mocked_jwt_token");

        // Thực thi
        AuthResponse response = authService.login(loginRequest);

        // Kiểm tra kết quả
        assertNotNull(response);
        assertEquals("mocked_jwt_token", response.getToken());
        assertEquals("test_user", response.getUsername());
        
        // Đảm bảo các hàm mock được gọi đúng
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername("test_user");
    }
}
