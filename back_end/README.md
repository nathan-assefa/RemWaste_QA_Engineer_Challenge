# 🛠️ Node.js Backend API for Modern Todo App

A robust, production-ready RESTful API built with Node.js, Express, TypeScript, and Prisma ORM. This backend powers the Modern Todo App, providing secure authentication and full CRUD operations for todo items. Designed for scalability, testability, and easy integration with any modern frontend.

---

## 🚀 Features

- **User Authentication**: JWT-based login, signup, and secure route protection
- **Todo Management**: Create, read, update, and delete todo items
- **TypeScript**: Full type safety and modern code practices
- **Prisma ORM**: Type-safe database access (PostgreSQL, SQLite, etc.)
- **Express Middleware**: Clean separation of concerns
- **Comprehensive Testing**: Jest & Supertest integration tests (positive & negative cases)
- **Environment Config**: `.env` support for secrets and DB config
- **Production Ready**: Error handling, security best practices, and clear structure

---

## 📦 Project Structure

```
back_end/
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server entry point
│   ├── controllers/          # Route controllers (auth, item)
│   ├── routes/               # Express routers
│   ├── middleware/           # Auth & error middleware
│   ├── models/               # Data models (if needed)
│   ├── data/                 # Seed/mock data
│   ├── utils/                # Utility functions
│   └── tests/                # Jest & Supertest integration tests
│       └── api.test.ts
│
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   └── migrations/           # DB migrations
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- PostgreSQL, SQLite, or other supported DB (see `prisma/schema.prisma`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd back_end
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` and set your DB connection string and JWT secret.

3. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Server**
   ```bash
   npm run dev
   # or for production
   npm run build && npm start
   ```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| POST   | `/api/auth/signup`   | Register new user     |
| POST   | `/api/auth/login`    | Login user            |
| POST   | `/api/auth/logout`   | Logout user           |
| GET    | `/api/auth/me`       | Get current user info |

### Todos
| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| GET    | `/api/items`         | Get all todos         |
| POST   | `/api/items`         | Create new todo       |
| PUT    | `/api/items/:id`     | Update todo           |
| DELETE | `/api/items/:id`     | Delete todo           |

---

## 🧪 Testing

This project uses **Jest** and **Supertest** for comprehensive integration testing.

### Running Tests
```bash
npm run test
```

### Test Coverage
- **Authentication**
  - Signup: success, user already exists
  - Login: success, invalid credentials, missing JWT secret
- **Todos**
  - Get all items: success, unauthorized
  - Create item: success, missing fields
  - Update item: success, missing fields, non-existent item
  - Delete item: success, non-existent item

### Example Test Cases
- ✅ Signup with valid data returns 201
- ✅ Signup with existing email returns 400
- ✅ Login with valid credentials returns 200 and token
- ✅ Login with invalid credentials returns 401
- ✅ Login with missing JWT secret returns 401
- ✅ Get items with valid token returns 200 and array
- ✅ Get items without token returns 401
- ✅ Create item with valid data returns 201
- ✅ Create item with missing fields returns 400
- ✅ Update item with valid data returns 200
- ✅ Update non-existent item returns 404
- ✅ Delete item returns 200/204
- ✅ Delete non-existent item returns 404

---

## 🛡️ Security & Best Practices
- Passwords should be hashed in production (use bcrypt or argon2)
- JWT secret must be set in environment variables
- Use HTTPS in production
- Validate and sanitize all user input
- Use environment variables for all secrets

---

## 🧩 Integration
- Designed to work seamlessly with the [Modern Todo App Frontend](../front_end/todo_app/README.md)
- API base URL: `http://localhost:3001/api`
- Update CORS settings in `app.ts` if integrating with a different frontend origin

---

## 📝 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Node.js, Express, TypeScript, and Prisma.**
