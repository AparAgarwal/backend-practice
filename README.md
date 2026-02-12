# Backend Development Learning Journey

This repository documents my journey learning backend development from scratch. Each commit represents a new concept or feature explored, from basic routing to advanced authentication patterns.

## About This Project

This is a hands-on learning project where I build a REST API using Node.js, Express, and MongoDB. The goal is to understand backend fundamentals by implementing them piece by piece, rather than using frameworks that hide the complexity.

## What's Inside

- **User Management System** with secure password handling using bcrypt
- **Authentication & Authorization** with JWT tokens
- **Clean Architecture** with controllers, models, and middleware
- **Error Handling** with custom error classes and global error middleware
- **Database Integration** using MongoDB and Mongoose

## Following Along

This repository is a companion to my [Backend Fundamentals Series](https://blog.aparagarwal.tech/posts/backend-fundamentals-roadmap) where I document everything I learn in detail. Each blog post corresponds to specific commits in this repo.

📖 **Read the series:** [Backend Fundamentals Roadmap](https://blog.aparagarwal.tech/posts/backend-fundamentals-roadmap)  
📚 **Browse all posts:** [Blog Archive](https://blog.aparagarwal.tech/archive)

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/practice
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

---

**Note:** This is a learning project. The code evolves with each commit as I discover better patterns and practices.