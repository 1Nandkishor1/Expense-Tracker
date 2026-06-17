SplitEase 💸

> A full-stack group expense management application that simplifies shared finances with intelligent debt minimization.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://expense-tracker-4rwx.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/1Nandkishor1/Expense-Tracker)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)

---

📌 Overview

SplitEase is a production-grade MERN stack application inspired by Splitwise. It allows users to create groups, track shared expenses, and settle balances — with a smart debt simplification algorithm that minimizes the number of transactions needed to settle all dues within a group.

---

 ✨ Features

- Group Management** — Create groups, invite members via link, and manage participants
- Expense Tracking** — Add, categorize, and split expenses across group members
- Debt Simplification Algorithm** — Minimizes the number of settlement transactions required
- Balance Calculation** — Redis-cached real-time balance computation per group
- Settlement Workflow** — Mark settlements with payment proof uploads via ImageKit
- Secure Authentication** — JWT-based auth with Redis token blacklisting for logout security
- Group Invitations** — Shareable invite links with token-based validation
- Profile Management** — Update profile details and avatar

---

🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, SCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Caching | Redis (balances + token blacklist) |
| Auth | JWT, bcryptjs |
| Media | ImageKit (payment proof uploads) |
| Deployment | Render |

---

## 📁 Project Structure

```
SplitEase/
├── Backend/
│   ├── route/
│   │   ├── user.route.js
│   │   ├── group.route.js
│   │   ├── expense.route.js
│   │   ├── balance.router.js
│   │   ├── settlement.route.js
│   │   ├── invite.route.js
│   │   ├── image.route.js
│   │   └── profile.route.js
│   ├── app.js
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── api/
    │   └── style/
    └── vite.config.js
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud)
- ImageKit account

### 1. Clone the repository

```bash
git clone https://github.com/1Nandkishor1/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `/Backend`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
CLIENT_URL=http://localhost:5173
```

```bash
node server.js
```

### 3. Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers/logs in → JWT token issued and stored in an `httpOnly` cookie
2. On logout → token is blacklisted in Redis, preventing reuse
3. Protected routes verify token against Redis blacklist before granting access

---

## 🧮 Debt Simplification Algorithm

Instead of tracking every individual transaction (which grows exponentially in large groups), SplitEase computes the **net balance** of each member and uses a greedy algorithm to pair the largest debtor with the largest creditor — reducing the total number of settlements to the theoretical minimum.

---

## 🚀 Deployment

The application is deployed as a unified service on Render:

- Backend serves the API routes under `/api/*`
- Frontend `dist` is served as static files from the Express server
- Redis and MongoDB are connected via cloud-hosted instances

**Live URL:** [https://expense-tracker-4rwx.onrender.com](https://expense-tracker-4rwx.onrender.com)

---



## 🙋‍♂️ Author

**Nandkishor Kumhar**
- GitHub: [@1Nandkishor1](https://github.com/1Nandkishor1)
- Email: kumharnandkishor01@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
