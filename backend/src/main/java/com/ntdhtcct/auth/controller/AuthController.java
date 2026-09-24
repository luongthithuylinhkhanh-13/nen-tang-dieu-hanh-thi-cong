package com.ntdhtcct.auth.controller;

import com.ntdhtcct.auth.dto.AuthResponse;
import com.ntdhtcct.auth.dto.LoginRequest;
import com.ntdhtcct.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // API tạm thời để tạo tài khoản admin (phục vụ test)
    @PostMapping("/register-admin")
    public ResponseEntity<String> registerAdmin() {
        authService.registerDefaultAdmin();
        return ResponseEntity.ok("Default admin created (admin / admin123)");
    }
}
