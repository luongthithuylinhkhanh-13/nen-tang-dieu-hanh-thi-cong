# BÁO CÁO KẾT QUẢ KIỂM THỬ (TEST REPORT) - GIAI ĐOẠN 1
**Dự án:** Nền tảng điều hành thi công công trình
**Mô-đun:** Authentication & Authorization (Backend)
**Thực hiện bởi:** Backend Developer
**Tiến độ:** Hoàn thành các Task lõi của T-08.

---

## 1. Mục tiêu (Objectives)
Hoàn thành việc cài đặt kiến trúc Spring Security và xác thực JWT token. Viết Unit Test và Integration Test để đảm bảo luồng đăng nhập và phân quyền hoạt động ổn định.

## 2. Kết quả Unit Test (T-08.5, T-08.6)
Sử dụng **JUnit 5** và **Mockito** để test logic nội bộ không phụ thuộc vào Database.

| Mã Task | Lớp Kiểm Thử | Trường Hợp (Test Case) | Kết Quả |
| :--- | :--- | :--- | :--- |
| **T-08.5** | `AuthServiceTest` | `testLogin_Success`: Đăng nhập đúng, trả về đầy đủ Token, Username và Role. | 🟢 PASS |
| **T-08.6** | `JwtUtilsTest` | `testGenerateAndValidateToken`: Token sinh ra phải chứa thông tin chính xác và giải mã thành công. | 🟢 PASS |
| **T-08.6** | `JwtUtilsTest` | `testValidateToken_InvalidToken`: Cố tình truyền token rác, hàm phải trả về False để chặn request. | 🟢 PASS |

## 3. Kết quả Integration Test (T-08.7, T-08.8, T-08.13)
Sử dụng **MockMvc** và **H2 Database** để test luồng gọi API từ Controller xuống tận Database.

| Mã Task | Lớp Kiểm Thử | Trường Hợp (Test Case) | Kết Quả |
| :--- | :--- | :--- | :--- |
| **T-08.7** | `AuthIntegrationTest` | `testLogin_Success`: Gọi HTTP POST `/api/auth/login` với dữ liệu chuẩn, nhận về HTTP 200 OK và JWT Token. | 🟢 PASS |
| **T-08.7** | `AuthIntegrationTest` | `testLogin_Failure_WrongPassword`: Gửi sai mật khẩu, hệ thống lập tức báo HTTP 403 (Hoặc 401 tùy thiết lập). | 🟢 PASS |
| **T-08.8** (kèm T-08.13) | `AuthIntegrationTest` | `testAuthorization_AccessWithoutToken_ShouldFail`: Cố tình gọi HTTP GET vào API bảo mật khi chưa đăng nhập, lập tức bị từ chối truy cập (HTTP 403 Forbidden). | 🟢 PASS |

## 4. Báo cáo kỹ thuật (Spike) - Task T-08.14
- Đã cấu hình thành công: `spring-boot-starter-security`, thư viện `jjwt`.
- Đã tách riêng môi trường: Sử dụng PostgreSQL cho code thật (đọc qua `.env`), và dùng H2 Database in-memory tự xóa dữ liệu cho môi trường Test (file `application-test.yml`).

## 5. Kế hoạch tiếp theo
- Dựa trên nền tảng Auth này, chuyển sang triển khai cấu trúc Database và REST API cho `Work Item` (Task T-08.9).
- Bổ sung logic khóa tài khoản khi nhập sai nhiều lần (T-08.12).
