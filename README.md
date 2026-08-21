# HireHelper

> A full-stack web application that connects people who need help with tasks with users who are willing to provide assistance.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📌 Project Overview

**HireHelper** is a full-stack web application developed as part of the **Infosys Springboard Virtual Internship**.

The platform is designed to connect users who need assistance with tasks with people who are willing to help. Users can explore the platform, create an account, securely authenticate themselves, create and manage tasks, interact with task-related features, and access different sections of the application.

The project follows a modern full-stack architecture with a **React frontend**, **Node.js and Express backend**, and **MongoDB database**.

---

# 🚀 Features

## 🌐 Guest User Experience

Users who visit the platform without logging in can access the guest-facing home page.

The guest dashboard introduces users to HireHelper and provides information about the platform.

Key elements include:

- Platform introduction
- Find Tasks option
- Become a Helper option
- How HireHelper works
- Trusted helpers
- Platform statistics
- Navigation to Login and Registration
- General information about the platform

---

# 🔐 Authentication System

HireHelper includes a complete authentication system.

### User Registration

Users can create an account using:

- First Name
- Last Name
- Email Address
- Phone Number
- Password

Passwords are securely hashed using **bcrypt** before being stored.

### Email OTP Verification

After registration:

1. An OTP is generated.
2. The OTP is sent to the user's registered email address.
3. The user verifies the OTP.
4. The account becomes verified.

Users can also request a new OTP if required.

### Login

Registered and verified users can log in using:

- Email
- Password

After successful authentication:

- Password credentials are verified using bcrypt.
- A JWT token is generated.
- The token is used for authenticated API access.

### Forgot Password

Users who forget their password can:

1. Enter their registered email address.
2. Request a password reset link.
3. Receive a reset link through email.
4. Open the reset password page.

### Reset Password

Users can securely reset their password by:

- Opening the password reset link.
- Entering a new password.
- Confirming the new password.
- Updating the password in the database.

The user can then log in using the new password.

### Protected Routes

JWT-based authentication middleware protects authorized backend routes.

Examples include:

- User profile access
- Authenticated user operations
- Other protected API functionality

### Logout

The application includes logout functionality for authenticated users.

---

# 📋 Task Management

Task management is one of the major modules of HireHelper.

The application provides functionality related to:

- Creating tasks
- Adding task details
- Viewing tasks
- Managing personal tasks
- Task-related requests
- Viewing task information
- Applicant or helper-related interactions
- Task management workflows

The frontend contains dedicated pages for task-related operations.

---

# ➕ Add Task

The **Add Task** module allows users to create and submit task-related information.

The general workflow is:

```text
User
  ↓
Add Task Form
  ↓
Submit Task Details
  ↓
Frontend API Request
  ↓
Backend Processing
  ↓
MongoDB Database
  ↓
Task Created
```

---

# 📝 My Tasks

The **My Tasks** section allows users to access tasks associated with their account.

This module provides a centralized interface for viewing and managing task-related information.

The application includes routes related to:

- My Tasks
- Task details
- Task requests
- Applicants and related task interactions

---

# 🔎 Feed and Discovery

The project includes a Feed module that allows users to access and explore information available through the platform.

The Feed is integrated into the overall application navigation and user experience.

---

# ⚙️ Settings

The application includes a Settings page for user-related configuration and account functionality.

---

# 🖥️ Application Pages

The HireHelper application includes multiple frontend pages and routes.

Some of the major pages include:

| Page | Description |
|---|---|
| Guest Dashboard / Home | Entry point for users visiting the platform |
| Register | Create a new user account |
| Verify OTP | Verify email using OTP |
| Login | Authenticate existing users |
| Forgot Password | Request a password reset link |
| Reset Password | Create a new password |
| Dashboard | Main application dashboard |
| Add Task | Create a new task |
| My Tasks | View and manage tasks |
| Feed | Explore platform content |
| Settings | User settings and configuration |

---

# 🏗️ System Architecture

HireHelper follows a client-server architecture.

```text
┌───────────────────────────────┐
│         React Frontend        │
│                               │
│  Components • Pages • Routes  │
└───────────────┬───────────────┘
                │
                │ Axios / REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express.js     │
│                               │
│ Routes • Controllers • Logic  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│            MongoDB            │
│                               │
│ Users • Tasks • Application   │
│            Data              │
└───────────────────────────────┘
```

For email-related functionality:

```text
Backend
   ↓
Nodemailer
   ↓
User Email
```

For authentication:

```text
User Login
    ↓
Credentials Verified
    ↓
JWT Generated
    ↓
Token Sent to Frontend
    ↓
Protected API Requests
    ↓
Authorization Middleware
```

---

# 🔄 Frontend and Backend Integration

The frontend communicates with the backend using REST APIs.

The general request flow is:

```text
React Component
      ↓
Service Layer
      ↓
Axios Request
      ↓
Express Route
      ↓
Controller
      ↓
Business Logic
      ↓
MongoDB
      ↓
API Response
      ↓
Frontend Update
```

Axios is used to communicate with backend APIs.

The frontend API configuration handles:

- Base API URL
- HTTP requests
- Authentication token handling
- Authorization headers

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS
- React Icons
- Lucide React

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt
- OTP verification
- Password reset tokens
- Protected routes

## Email Services

- Nodemailer

## Development Tools

- Git
- GitHub
- Postman
- MongoDB Atlas
- VS Code

---

# 📂 Project Structure

The project follows a frontend-backend structure.

```text
HireHelper_Team1
│
├── client
│   ├── src
│   │   ├── config
│   │   ├── features
│   │   │   ├── auth
│   │   │   ├── dashboard
│   │   │   ├── tasks
│   │   │   ├── feed
│   │   │   └── settings
│   │   │
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── docs
│   └── HireHelper_Presentation.pptx
│
├── .gitignore
└── README.md
```

> The exact internal structure may evolve as new modules and features are added.

---

# ⚡ Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

---

# 📥 Clone the Repository

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd HireHelper_Team1
```

---

# 💻 Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Open another terminal and navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email_address

EMAIL_PASS=your_email_app_password
```

> ⚠️ Never commit real credentials, passwords, database URIs, JWT secrets, or API keys to GitHub.

Start the backend server:

```bash
npm run dev
```

The backend will typically run at:

```text
http://localhost:5000
```

---

# 🔑 Environment Variables

The backend requires environment variables similar to the following:

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT generation |
| `EMAIL_USER` | Email account used for sending emails |
| `EMAIL_PASS` | Email app password |

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

---

# 🔌 API Architecture

The backend follows a structured approach:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Business Logic
   ↓
Model / Database
   ↓
Response
```

Authentication-related API functionality includes endpoints for:

```text
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/resend-otp
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
```

Some routes require JWT authentication.

---

# 🔐 Authentication Flow

```text
┌──────────────┐
│   Register   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Generate OTP │
└──────┬───────┘
       ↓
┌──────────────┐
│ Send Email   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Verify OTP   │
└──────┬───────┘
       ↓
┌──────────────┐
│    Login     │
└──────┬───────┘
       ↓
┌──────────────┐
│ Generate JWT │
└──────┬───────┘
       ↓
┌──────────────┐
│ Access App   │
└──────────────┘
```

Password recovery:

```text
Forgot Password
       ↓
Enter Registered Email
       ↓
Reset Token Generated
       ↓
Reset Link Sent Through Email
       ↓
User Opens Reset Link
       ↓
Enter New Password
       ↓
Password Updated
       ↓
Login
```

---

# 🧪 Testing

API endpoints can be tested using tools such as:

- Postman
- Browser frontend
- Axios requests

Important flows that can be tested include:

- User registration
- OTP verification
- Resend OTP
- Login
- Protected routes
- Forgot password
- Reset password
- Task-related API operations

---

# 🌿 Git Workflow

The project was developed collaboratively using Git and GitHub.

The general workflow followed:

```text
Develop Branch
      ↓
Create Feature Branch
      ↓
Develop Feature
      ↓
Test Feature
      ↓
Git Commit
      ↓
Git Push
      ↓
Pull Request
      ↓
Review / Merge
      ↓
Develop Branch
```

Examples of feature branches include:

```text
feature/server-auth
feature/auth-integration
feature/auth-password-integration
```

The `develop` branch is used for integrating completed features.

---

# 👨‍💻 My Contribution

My primary contribution to HireHelper focused on **Backend Development and Authentication Integration**.

My work included:

- User registration API
- Password hashing using bcrypt
- OTP generation
- Email OTP verification
- Resend OTP functionality
- JWT-based login
- Authentication middleware
- Protected profile route
- Logout endpoint
- Forgot password flow
- Reset password flow
- Password reset token generation
- Nodemailer email integration
- MongoDB integration
- Frontend-backend authentication integration
- Register page API integration
- Login page API integration
- OTP verification integration
- Forgot password integration
- Reset password integration
- Git and GitHub workflow
- Feature branch management
- Pull requests and merging

---

# 👥 Team Collaboration

HireHelper was developed as a collaborative team project during the Infosys Springboard Virtual Internship.

Different team members contributed to various areas of the application, including:

- Frontend development
- Backend development
- Authentication
- Task-related features
- User interface development
- Dashboard development
- Application pages
- Integration
- Testing
- GitHub collaboration

The project was integrated through feature branches and pull requests into the shared development branch.

---

# 🎯 Learning Outcomes

Through the development of HireHelper, the team gained practical experience with:

- Full-stack web development
- React application development
- REST APIs
- Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication
- Password security
- OTP-based email verification
- Password recovery systems
- Frontend-backend integration
- API testing using Postman
- Git and GitHub collaboration
- Feature branching
- Pull requests
- Collaborative software development

---

# 🔮 Future Improvements

Possible future enhancements include:

- Improved real-time frontend and backend data synchronization
- Real-time notifications
- Enhanced task matching
- Improved search and filtering
- User ratings and reviews
- Better dashboard analytics
- Advanced task management
- Improved notification system
- Additional security features
- Improved scalability
- Enhanced mobile responsiveness

---

# 📄 Project Documentation

The project presentation and related documentation can be found in the `docs` directory.

```text
docs/
└── HireHelper_Presentation.pptx
```

---

# 🙏 Acknowledgement

This project was developed as part of the **Infosys Springboard Virtual Internship Program**.

---

# 📬 Conclusion

HireHelper demonstrates the development of a modern full-stack web application by integrating a React frontend with a Node.js and Express backend and MongoDB database.

The project combines multiple modules, including authentication, user interaction, task management, dashboards, and other application features, into a single platform.

The development of HireHelper provided practical experience in full-stack development, API integration, authentication, database management, and collaborative software development using Git and GitHub.

---

## ⭐ If you found this project interesting, feel free to explore the repository!