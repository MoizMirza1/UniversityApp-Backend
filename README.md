# University Management System - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)

A robust backend system for university management with JWT authentication, role-based access control, and RESTful APIs.



## Features
- JWT Authentication
- Role-based access control (Admin/Student/Faculty)
- RESTful API design
- MongoDB database
- Secure password hashing
- Error handling middleware
- CORS support
- Environment configuration

## Prerequisites
- Node.js 18.x
- MongoDB 6.x (local or Atlas)
- npm 9.x
- Postman (for API testing)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/university-backend.git

   cd university-backend
   ```

2. **Install dependencies**
 ```bash
npm install
```

3. **Set up environment variables**

## Local MongoDB
Connection string: mongodb://localhost:27017

Create database: university

Update .env According to your Database Name

## Seeding Data
```bash
node npm run db:reset
```


## Running the Server
```bash
node server.js
```
