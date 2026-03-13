# 💸 PennyPal
### Personal Finance Tracker + Friend Bill Splitter

> Built solo as a Semester 3 project · Full-stack web app · Java Spring Boot + Next.js + MySQL

[![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

---

## 1️⃣ What It Does

PennyPal combines two things that usually live in separate apps — **personal expense tracking** and **friend bill splitting** — into one platform.

Most expense trackers ignore shared costs. Most bill splitters ignore your personal finances. PennyPal does both:

- Track your own income and expenses with visual analytics
- Create groups with friends (added by username), log shared expenses, and split them equally or by custom amounts
- See everything in one dashboard

**[▶ Watch the Demo](https://drive.google.com/file/d/1z0GFkPTmG4vF4lNZA-MYNAc9VmdAGnjC/view?usp=sharing)**

> ⚠️ Bill splitting module is currently under active development.

---

## 2️⃣ Tech Stack

### Backend
| Category | Technology |
|----------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.3.5 |
| API | Spring Web (REST) |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT (JJWT) |
| Database | MySQL (prod) · H2 (testing) |
| Validation | Spring Validation |
| Utilities | Lombok · Jackson · Maven |

### Frontend
| Category | Technology |
|----------|-----------|
| Language | TypeScript |
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS |
| Components | ShadCN UI + Radix UI |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Theme | next-themes (dark/light mode) |
| Utilities | date-fns · clsx · sonner (toasts) |

---

## 3️⃣ Key Features

- 📊 **Expense Dashboard** — Visual analytics with income vs expense charts (Recharts)
- 💳 **Transaction Tracking** — Log and categorise personal income and expenses
- 👥 **Friend Groups** — Create groups, add friends by username
- ⚖️ **Bill Splitting** — Split shared expenses equally or by custom amounts
- 🔐 **JWT Authentication** — Secure token-based login and session management
- 🌙 **Dark / Light Mode** — Full theme switching via next-themes
- 📱 **Responsive UI** — Works across screen sizes

---

## 4️⃣ Project Architecture

```
PennyPal/
├── backend/                  # Spring Boot REST API
│   └── src/main/java/
│       ├── controller/       # REST endpoints
│       ├── services/         # Business logic
│       ├── repository/       # JPA data layer
│       ├── model/            # Entity classes
│       └── config/           # JWT + Security config
│
└── frontend/                 # Next.js App Router
    └── app/
        ├── login/
        ├── register/
        └── dashboard/
            ├── analytics/
            ├── bills/
            └── transactions/
```

---

## 5️⃣ Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL server running locally

> **Important:** Start your MySQL server before running the backend.
>
> **Windows:** `net start mysql` or Open Services → MySQL → Start
>
> **Mac/Linux:** `sudo systemctl start mysql`

---

### Backend Setup

1. Create a MySQL database:
```sql
CREATE DATABASE pennypal;
```

2. Create `.env` or update `application.properties` in `backend/src/main/resources/`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pennypal
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key
```

3. Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at **http://localhost:8080**

---

### Frontend Setup

1. Create `.env.local` in the `frontend/` folder:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Run the frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:3000**

---

## 6️⃣ API Overview

The backend exposes REST APIs for:
- User registration and login (JWT token issued on login)
- Transaction CRUD (create, read, update, delete)
- Group management (create groups, add members by username)
- Bill creation and split calculation (equal and custom splits)
- Analytics data (expense summaries by category and date)

All protected endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 7️⃣ Future Improvements

- 🔧 Complete bill splitting settlement flow
- 📧 Email notifications for pending splits
- 📤 Export transactions as CSV/PDF
- 📱 Mobile app (React Native)
- 🔄 Recurring transaction support
- 📊 Budget goal setting and alerts
