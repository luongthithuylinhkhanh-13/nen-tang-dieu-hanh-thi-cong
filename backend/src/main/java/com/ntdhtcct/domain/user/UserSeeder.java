package com.ntdhtcct.domain.user;

import com.ntdhtcct.domain.role.Role;
import com.ntdhtcct.domain.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeeder(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail("test@test.com")) {
            return;
        }

           Role role = roleRepository.findByName("CUSTOMER")
           .orElseGet(() -> roleRepository.save(new Role("CUSTOMER")));
            User user = new User();

        user.setEmail("test@test.com");

        // Password: 12345678
        // Được mã hóa bằng Argon2 trước khi lưu database
        user.setPassword(
                passwordEncoder.encode("12345678")
        );

        user.setFullName("Test User");
        user.setRoleId(role.getId());
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);

        OffsetDateTime now = OffsetDateTime.now();
        user.setUpdatedAt(now);

        // created_at không có setter nên JPA sẽ cần xử lý giá trị này
        userRepository.save(user);
    }
}