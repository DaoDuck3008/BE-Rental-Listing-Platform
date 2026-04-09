# 🛡️ Rental Listing Platform - Backend API Gateway

[English](#) | [🇻🇳 Bản Tiếng Việt (Vietnamese)](./README.vi.md)

---

> **Description:** The core API gateway for the rental platform, built with Service-oriented architecture, robust security, and high performance.

---

## 🚀 Overview

This backend project is designed to handle real-world challenges such as **Performance Optimization (Redis)**, **Real-time Communication (Socket.io)**, and **Multi-layer Security (JWT/RBAC)**. 

It serves as the centralized engine of the Rental Listing Platform, providing data services to the [Frontend Application](https://github.com/DaoDuck3008/FE-Rental-Listing-Platform), ensuring data integrity, secure authentication, and efficient state synchronization.


---

## 🛠️ Tech Stack & Architecture

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL with **Sequelize ORM**
- **Caching:** **Redis** (Used for high-traffic view counting & rate limiting)
- **Security:** Helmet, CORS, Argon2/Bcrypt, express-rate-limit.
- **Validation:** **Zod** (End-to-end data integrity).
- **Other:** Socket.io (Real-time), Cloudinary (Images), Nodemailer (Emails), Node-cron (Jobs).

---

## ✨ Key Features

### 1. Advanced Authentication & RBAC
- **JWT Flow:** Full implementation of Login/Logout with **Access Tokens** and **Refresh Tokens**.
- **Social Login:** Integrated Google OAuth 2.0.
- **Role-Based Access Control:** Secure routes for `Admin`, `Host`, and `User`.

### 2. High Performance View Counting
- **Redis Cache:** Listing views are stored in Redis first to reduce primary database write load.
- **Cron Jobs:** Background processes synchronize view counts from Redis to PostgreSQL periodically.

### 3. Comprehensive Listing Management
- **Search & Filtering:** Complex Postgres queries for location, price ranges, and property types.
- **Image Processing:** Automated uploads and optimizations via Cloudinary.

### 4. Real-time Notifications
- **Socket.io Integration:** Toast notifications for users when listings are updated or chats are received.

---

## 🏗️ Folder Structure

```text
src/
├── config/       # Database, Redis, Mail configuration
├── controllers/  # Request handlers
├── services/     # Core business logic (Service Layer)
├── models/       # Sequelize models
├── routes/       # API route definitions
├── middlewares/  # Auth, Error handling, Validation
├── jobs/         # Node-cron background tasks
├── sockets/      # Socket.io event logic
└── utils/        # Shared helper functions
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis Server (Required for production features)

### Installation

#### 🐳 Option 1: Using Docker (Recommended)
*(The project is being containerized. Docker scripts will be available soon.)*

#### 🛠️ Option 2: Manual Setup
1.  **Clone the project:** 
    ```bash
    git clone https://github.com/DaoDuck3008/BE-Rental-Listing-Platform.git
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    - Copy `.env.example` to `.env`.
    - Provide your PostgreSQL and Cloudinary credentials.
4.  **Database Migration:**
    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```
5.  **Run Dev Server:**
    ```bash
    npm run dev
    ```


---

## 📜 API Documentation

We use **Swagger UI** for comprehensive and interactive API documentation. 
Below is a demonstration of our API Gateway:

<video src="./assets/API_Gateway.mp4" controls="controls" muted="muted" playsinline="playsinline" width="100%">
</video>

- **Swagger (Local):** `http://localhost:5000/api-docs`
- **Swagger (Production):** `https://rental.daoduck.id.vn/api-docs/`
- **Health Check:** `GET /` 

### Main API Groups

- **Auth:** `/api/auth`
- **Listings:** `/api/listings`
- **Users:** `/api/users`
- **Notifications:** `/api/notifications`

### Demo Test Account

- **Email:** `reviewer.demo@example.com`
- **Password:** `Demo@123456`
- **Role:** `User` (non-admin)


### Production Security Note

To protect sensitive operations, **Admin routes are hidden from public Swagger docs in production**.  
Admin APIs are still protected by authentication and role-based access control (RBAC) at runtime.

---

## 🤝 Contact
- **Author:** Duc Dao
- **GitHub:** [@DaoDuck3008](https://github.com/DaoDuck3008)
- **Project Goal:** Internship Project and Portfolio Showcase.
