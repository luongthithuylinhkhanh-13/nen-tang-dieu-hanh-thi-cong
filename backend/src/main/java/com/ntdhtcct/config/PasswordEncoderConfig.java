package com.ntdhtcct.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class PasswordEncoderConfig {

    /**
     * Bean PasswordEncoder dùng Argon2id.
     *
     * <p>Salt ngẫu nhiên được tự động sinh và nhúng vào encoded hash,
     * không cần lưu salt riêng trong database.</p>
     *
     * <p>Encoded hash có định dạng: {@code $argon2id$v=19$...}</p>
     *
     * @return PasswordEncoder sử dụng Argon2id
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        int saltLength   = 16;
        int hashLength   = 32;
        int parallelism  = 1;
        int memory       = 65536; // 64 MB
        int iterations   = 3;
        return new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);
    }
}
