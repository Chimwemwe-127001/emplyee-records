# Employee Record Management System

A full-stack web application for managing employee records with authentication, built with Next.js, MongoDB, and NextAuth.js.

![Employee Dashboard Screenshot](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Task_manager-KymZtqbJACZF7EmvWaCd2bYRGLO6Hg.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development Approach](#development-approach)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)

## 🔍 Overview

This Employee Record Management System provides a clean, intuitive interface for managing employee information. It allows users to create, read, update, and delete employee records while ensuring data security through authentication.

The application was built as part of a technical assessment to demonstrate proficiency in full-stack development using modern web technologies. The design is inspired by a provided Figma link, ensuring a responsive and user-friendly experience.

## ✨ Features

### Employee Management
- **Create**: Add new employees with first name, last name, email, phone, and role (Admin/Staff).
- **Read**: View all employees in a paginated table (10 per page) with search functionality by name or email.
- **Update**: Edit employee details (first name, last name, phone; email and role are immutable post-creation).
- **Delete**: Remove employees from the database with a confirmation prompt.

### Authentication
- **User Registration**: Sign up with email and password.
- **User Login**: Secure authentication using JWT tokens.
- **Protected Routes**: Only authenticated users can access the dashboard; unauthenticated users are redirected to the sign-in page.
- **Session Management**: Persistent sessions managed with NextAuth.js.

### User Experience
- **Responsive Design**: Works seamlessly on mobile and desktop devices using Tailwind CSS.
- **Search & Filter**: Quickly find employees using a search bar.
- **Pagination**: Navigate through large datasets with pagination controls.
- **Form Validation**: Client and server-side validation for all input fields.
- **Toast Notifications**: Immediate feedback on actions (e.g., success or error messages) via `react-hot-toast`.
- **Loading States**: Visual indicators (spinners) during data fetching.

## 🛠️ Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering (SSR) and API routes.
- **React**: UI component library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Hook Form**: Form validation and handling (optional, can be added if used).
- **React Hot Toast**: Toast notifications for user feedback.

### Backend
- **Next.js API Routes**: Server-side API endpoints for CRUD operations.
- **MongoDB**: NoSQL database for storing employee and user data.
- **Mongoose**: MongoDB object modeling for Node.js with schema validation.
- **NextAuth.js**: Authentication library for Next.js with JWT support.
- **bcryptjs**: Password hashing for secure user credentials.

### Development Tools
- **TypeScript**: Static type checking (if used; otherwise, JavaScript).
- **ESLint**: Code linting for consistency (optional, can be added).
- **Git**: Version control.
- **GitHub**: Code repository hosting.
- **Vercel**: Deployment platform.

## 🏗️ Architecture

The application follows a modern full-stack architecture:

1. **Frontend Layer**: React components rendered with Next.js, styled with Tailwind CSS.
2. **API Layer**: Next.js API routes handle HTTP requests and business logic.
3. **Data Layer**: MongoDB database with Mongoose schemas for data modeling.
4. **Authentication Layer**: NextAuth.js for secure user authentication and session management.

This architecture provides several benefits:
- **Performance**: SSR for fast initial page loads and SEO optimization.
- **SEO**: Pre-rendered content improves search engine visibility.
- **Developer Experience**: Unified codebase for frontend and backend development.
- **Scalability**: Leverages serverless functions on Vercel for easy scaling.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB database (local instance or MongoDB Atlas)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Chimwemwe-127001/employee-record-app.git
   cd employee-record-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/employee-record-app
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```
   - `MONGODB_URI`: Your MongoDB connection string (e.g., local or MongoDB Atlas URI like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee-record-app`).
   - `NEXTAUTH_URL`: The base URL of your app (update to your deployed URL in production).
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js (generate with `openssl rand -base64 32`).

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Test the Application**:
   - Navigate to `/signin` to sign up with a new email and password.
   - Log in to access the `/employees` dashboard and test CRUD operations.

## 🛠️ Development Approach

### Task 1: CRUD Implementation
- **Backend**: Designed MongoDB schemas with Mongoose for the `Employee` model (fields: `firstName`, `lastName`, `email`, `phone`, `role` with a unique `email` index). Implemented Next.js API routes for CRUD operations:
  - `GET /api/employees`: Fetch all records.
  - `POST /api/employees`: Create a new employee with validation.
  - `PUT /api/employees/[id]`: Update specific fields.
  - `DELETE /api/employees/[id]`: Delete a record.
- **Frontend**: Used SSR with `getServerSideProps` to fetch data. Built a reusable `EmployeeDashboard` component with Tailwind CSS for styling, including pagination, search, and modals. Handled errors with try-catch blocks and toast notifications.
- **Challenges**: Ensuring email uniqueness was addressed with MongoDB’s unique index and custom error handling.

### Task 2: Authentication
- **Setup**: Configured NextAuth.js with a Credentials provider, using `bcryptjs` to hash passwords. Stored users in a `User` model.
- **Protection**: Used `useSession` to restrict access to the dashboard, redirecting unauthenticated users to `/signin`.
- **Challenges**: Syncing `NEXTAUTH_URL` with the deployed environment was resolved by updating it post-deployment.

### UI/UX
- Aligned with Figma design using Tailwind CSS for responsive layouts and custom checkbox styling (`checked:bg-[#2bda53]`).
- Added loading states and toast notifications for a smooth user experience.

## 📚 API Documentation

### Endpoints
- **GET /api/employees**
  - Description: Fetch all employee records.
  - Response: `200` with array of employees, or `500` on error.
- **POST /api/employees**
  - Description: Create a new employee.
  - Body: `{ firstName, lastName, email, phone, role }`
  - Response: `201` on success, `400` for validation errors, `409` for duplicate email.
- **PUT /api/employees/[id]**
  - Description: Update an employee’s details.
  - Body: `{ firstName, lastName, phone }`
  - Response: `200` on success, `404` if not found, `400` for invalid data.
- **DELETE /api/employees/[id]**
  - Description: Delete an employee.
  - Response: `200` on success, `404` if not found.

## 🔐 Authentication Flow
1. **Sign-Up**:
   - User submits email and password at `/signin`.
   - Password is hashed with `bcryptjs` and stored in MongoDB.
   - JWT token is generated upon successful registration.
2. **Login**:
   - User enters credentials at `/signin`.
   - `bcryptjs.compare` verifies the password, and a JWT session is created.
3. **Protected Access**:
   - `useSession` checks authentication status; redirects to `/signin` if unauthenticated.
4. **Logout**:
   - Clears the session via `signOut` from NextAuth.js.
---
## 🚀 Deployment
The app is deployed on Vercel for this assessment.
- Live URL: https://emplyee-records-git-dev-chimwemwe-127001s-projects.vercel.app/
---
## 🙌 Conclusion

This Employee Record Management System showcases a robust full-stack application built with Next.js, MongoDB, and NextAuth.js, meeting all assessment requirements. The code is modular, well-documented, and follows best practices, with a responsive UI aligned with the Figma design. Thank you for the opportunity to demonstrate my skills—I look forward to your feedback!
