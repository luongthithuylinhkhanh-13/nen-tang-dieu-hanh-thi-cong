package com.ntdhtcct.config;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * T-03.3: Unit test xác minh PasswordEncoder dùng thuật toán Argon2id.
 *
 * <p>Test không cần Spring context — khởi tạo trực tiếp từ {@link PasswordEncoderConfig}.</p>
 */
class PasswordEncoderConfigTest {

    private static PasswordEncoder encoder;

    @BeforeAll
    static void setUp() {
        // Khởi tạo trực tiếp, không cần Spring context
        encoder = new PasswordEncoderConfig().passwordEncoder();
    }

    // -------------------------------------------------------------------------
    // Test 1: Password phải được hash (hash != plaintext)
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("encode() trả về hash khác với plaintext")
    void encode_returnsHashNotEqualToPlaintext() {
        String plain = "password123";
        String hash = encoder.encode(plain);

        assertThat(hash)
                .as("Hash không được bằng plaintext")
                .isNotEqualTo(plain);
    }

    // -------------------------------------------------------------------------
    // Test 2: Hash phải có định dạng Argon2id
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("encoded hash có định dạng Argon2id ($argon2id$)")
    void encode_producesArgon2idFormat() {
        String plain = "securePassword8";
        String hash = encoder.encode(plain);

        assertThat(hash)
                .as("Hash phải bắt đầu bằng $argon2id$ (định dạng Argon2id)")
                .startsWith("$argon2id$");
    }

    // -------------------------------------------------------------------------
    // Test 3: Password đúng → matches() trả về true
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("matches() trả về true khi password đúng")
    void matches_correctPassword_returnsTrue() {
        String plain = "password123";
        String hash = encoder.encode(plain);

        assertThat(encoder.matches(plain, hash))
                .as("matches() phải trả về true với password đúng")
                .isTrue();
    }

    // -------------------------------------------------------------------------
    // Test 4: Password sai → matches() trả về false
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("matches() trả về false khi password sai")
    void matches_wrongPassword_returnsFalse() {
        String plain = "password123";
        String hash = encoder.encode(plain);

        assertThat(encoder.matches("wrong-password", hash))
                .as("matches() phải trả về false với password sai")
                .isFalse();
    }

    // -------------------------------------------------------------------------
    // Test 5: Encode cùng một password → hai hash phải khác nhau (salt ngẫu nhiên)
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("encode() cùng password hai lần → hai hash khác nhau (salt ngẫu nhiên)")
    void encode_samePlaintext_producesDifferentHashes() {
        String plain = "password123";
        String hash1 = encoder.encode(plain);
        String hash2 = encoder.encode(plain);

        assertThat(hash1)
                .as("Hai hash của cùng một password phải khác nhau do salt ngẫu nhiên")
                .isNotEqualTo(hash2);

        // Nhưng cả hai vẫn phải verify được bằng password gốc
        assertThat(encoder.matches(plain, hash1))
                .as("hash1 phải verify được bằng password gốc")
                .isTrue();
        assertThat(encoder.matches(plain, hash2))
                .as("hash2 phải verify được bằng password gốc")
                .isTrue();
    }

    // -------------------------------------------------------------------------
    // Test 6: Password chỉ dài đúng minimum (8 ký tự) cũng phải được hash đúng
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("encode() và matches() hoạt động đúng với password minimum length (8 ký tự)")
    void encode_passwordAtMinimumLength_worksCorrectly() {
        String plain = "exactly8";
        String hash = encoder.encode(plain);

        assertThat(hash).startsWith("$argon2id$");
        assertThat(encoder.matches(plain, hash)).isTrue();
        assertThat(encoder.matches("exactly9", hash)).isFalse();
    }
}
