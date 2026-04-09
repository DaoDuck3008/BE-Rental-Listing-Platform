# 🛡️ Rental Listing Platform - Backend API Gateway (Bản Tiếng Việt)

[🇺🇸 English Version](./README.md) | [Tiếng Việt](#)

---

> **Mô tả:** Hệ thống API trung tâm cho nền tảng cho thuê bất động sản, được xây dựng với kiến trúc hướng dịch vụ, bảo mật cao và hiệu suất tối ưu.

---

## 🚀 Tổng quan

Dự án backend này được thiết kế để xử lý các bài toán thực tế như **Performance Optimization (Redis)**, **Real-time Communication (Socket.io)** và **Bảo mật đa lớp (JWT/RBAC)**. 

Đây là trung tâm điều khiển của nền tảng Rental Listing, cung cấp dịch vụ dữ liệu cho bản [Frontend Application](https://github.com/DaoDuck3008/FE-Rental-Listing-Platform), đảm bảo tính vẹn toàn của dữ liệu, xác thực người dùng an toàn và truyền tin đồng bộ.


---

## 🛠️ Công nghệ & Kiến trúc

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL kết hợp **Sequelize ORM**
- **Caching:** **Redis** (Sử dụng cho bộ đếm lượt xem Listing & Rate Limiting)
- **Security:** Helmet, CORS, Argon2/Bcrypt, express-rate-limit.
- **Validation:** **Zod** (Đảm bảo dữ liệu chuẩn từ Input đầu vào).
- **Khác:** Socket.io (Real-time), Cloudinary (Lưu trữ ảnh), Nodemailer (Email), Node-cron (Tự động hóa).

---

## ✨ Tính năng nổi bật

### 1. Xác thực & Phân quyền nâng cao
- **JWT Flow:** Triển khai đầy đủ Login/Logout với **Access Tokens** và **Refresh Tokens**.
- **Social Login:** Tích hợp Google OAuth 2.0.
- **RBAC:** Bảo vệ các Route theo vai trò người dùng (Admin, Host, User).

### 2. Tối ưu hóa đếm lượt xem (Performance)
- **Redis Cache:** Lượt xem tin đăng được lưu tạm vào Redis để giảm tải ghi trực tiếp cho Database.
- **Cron Jobs:** Sau một khoảng thời gian, hệ thống tự động đồng bộ số lượt xem từ Redis về PostgreSQL.

### 3. Quản lý tin thuê chuyên sâu
- **Tìm kiếm & Lọc:** Truy vấn PostgreSQL phức tạp theo vị trí, khoảng giá và loại hình nhà thuê.
- **Xử lý hình ảnh:** Tự động tải lên và tối ưu hóa ảnh qua Cloudinary.

### 4. Thông báo thời gian thực
- **Socket.io Integration:** Thông báo (Toast) tới người dùng khi có tin cập nhật hoặc tin nhắn mới.

---

## 🏗️ Cấu trúc thư mục

```text
src/
├── config/       # Cấu hình Database, Redis, Mail
├── controllers/  # Xử lý các Request
├── services/     # Logic nghiệp vụ chính (Service Layer)
├── models/       # Sequelize models
├── routes/       # Định nghĩa các Route API
├── middlewares/  # Auth, Error handling, Validation
├── jobs/         # Các tác vụ chạy ngầm với Node-cron
├── sockets/      # Logic sự kiện Socket.io
└── utils/        # Các hàm tiện ích dùng chung
```

---

## 🏁 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL
- Redis Server (Yêu cầu cho các tính năng production)

### Các bước cài đặt

#### 🐳 Cách 1: Sử dụng Docker (Khuyên dùng)
*(Hệ thống đang được đóng gói bằng Docker. Script sẽ sớm được cập nhật.)*

#### 🛠️ Cách 2: Cài đặt thủ công
1.  **Clone dự án:** 
    ```bash
    git clone https://github.com/DaoDuck3008/BE-Rental-Listing-Platform.git
    cd backend
    ```
2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```
3.  **Thiết lập môi trường:**
    - Copy `.env.example` thành `.env`.
    - Cấu hình thông số PostgreSQL và Cloudinary của bạn.
4.  **Database Migration:**
    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```
5.  **Chạy máy chủ Dev:**
    ```bash
    npm run dev
    ```


---

## 📜 Tài liệu API

Dự án sử dụng **Swagger UI** để cung cấp tài liệu API đầy đủ và có thể tương tác trực tiếp.

Dưới đây là video demo hệ thống API Gateway. **README trên GitHub không nhúng được player MP4**, nên hãy bấm link để mở hoặc tải file.

- **[Xem demo API Gateway (MP4)](../../assets/API_Gateway.mp4)**

- **Swagger (Local):** `http://localhost:5000/api-docs`
- **Swagger (Production):** `https://rental.daoduck.id.vn/api-docs/`
- **Health Check:** `GET /`

### Nhóm API chính

- **Auth:** `/api/auth`
- **Listings:** `/api/listings`
- **Users:** `/api/users`
- **Notifications:** `/api/notifications`

### Tài khoản test demo

- **Email:** `reviewer.demo@example.com`
- **Password:** `Demo@123456`
- **Role:** `User` (không phải admin)

### Ghi chú bảo mật trên Production

Để bảo vệ các thao tác nhạy cảm, **Admin routes được ẩn khỏi Swagger public trên môi trường production**.  
Các API admin vẫn được bảo vệ ở runtime bằng xác thực và phân quyền theo vai trò (RBAC).

---

## 🤝 Liên hệ
- **Tác giả:** Đào Anh Đức
- **GitHub:** [@DaoDuck3008](https://github.com/DaoDuck3008)
- **Mục tiêu:** Dự án Internship / Portfolio cá nhân.
