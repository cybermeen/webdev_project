# Willow Web-App

A web application that combines a digital scrapbook with a to-do list manager. Users can create accounts, manage daily logs with photos and notes, answer reflective prompts, and track tasks.

# Backend API for Scrapbook/To-Do App

## Features

- User authentication (register, login, logout)
- Daily scrapbook logs with photos, notes, and stickers
- Reflective prompts for journaling
- Task management with priorities and due dates
- File uploads for photos

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database named `willow` (or update the `.env` file accordingly)
   - Run the schema to create tables:
     ```bash
     psql -U postgres -d willow -f db/schema.sql
     ```
   - Seed the database with initial data:
     ```bash
     node seed.js
     ```

4. Configure environment variables:
   - Copy the `.env` file and update the values as needed:
     ```
     PORT=5000
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=willow
     DB_USER=postgres
     DB_PASSWORD=your_password_here
     SESSION_SECRET=your_secret_key_here
     UPLOAD_PATH=./uploads
     ```

5. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` (or the port specified in your `.env`).

## API Documentation

### Authentication Routes

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "User Name"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "display_name": "User Name",
    "is_first_login": true
  }
}
```

#### POST /api/auth/login
Log in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "User Name",
    "isFirstLogin": false
  }
}
```

#### POST /api/auth/logout
Log out the current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### To-Do Routes

#### GET /api/todo/:userId
Get all tasks for a specific user, categorized by status.

**Response (200):**
```json
{
  "pending": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the backend API",
      "due_date": "2024-12-31T23:59:59.000Z",
      "priority": "High",
      "status": "pending",
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ],
  "completed": []
}
```

#### POST /api/todo
Create a new task.

**Request Body:**
```json
{
  "user_id": 1,
  "title": "New Task",
  "description": "Task description",
  "due_date": "2024-12-31",
  "priority": "Medium"
}
```

**Response (201):**
```json
{
  "id": 2,
  "user_id": 1,
  "title": "New Task",
  "description": "Task description",
  "due_date": "2024-12-31T00:00:00.000Z",
  "priority": "Medium",
  "status": "pending",
  "created_at": "2024-12-15T12:00:00.000Z"
}
```

#### PATCH /api/todo/:id/toggle
Toggle the completion status of a task.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "completed",
  "completed_at": "2024-12-15T12:00:00.000Z"
}
```

#### DELETE /api/todo/:id
Delete a task.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### File Uploads

Static files are served from the `/uploads` directory. Uploaded images are stored here and can be accessed via `http://localhost:5000/uploads/filename`.



