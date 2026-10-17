# Team Chat

A real-time team communication application built with Next.js, TypeScript, Node.js, and Socket.IO.

## Features

- User registration, login, and authentication using JWT stored in HTTP-only cookies
- Real-time messaging with Socket.IO
- Chat rooms with membership management
- Unread message counts and read tracking
- Audio messages and file attachments
- Reply, edit, delete, and copy message actions
- Responsive chat interface
- Protected actions for authenticated users and room members

## Tech Stack

### Frontend
- Next.js
- React and TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Socket.IO Client

### Backend
- Node.js and Express
- TypeScript
- Socket.IO
- PostgreSQL
- Prisma ORM
- JWT and bcrypt
- Multer for file uploads

## Architecture

The application is organized into two separate applications:

- `frontend/` — the Next.js client application
- `backend/` — the Express API, authentication, database access, and real-time communication

The frontend communicates with the backend through HTTP APIs and Socket.IO. PostgreSQL stores application data, accessed through Prisma.

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/soosan1365/team-chat.git
cd team-chat
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables for your database connection, authentication secret, and server settings.

### 3. Start the backend

```bash
npm run dev
```

### 4. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file and configure the API and Socket.IO server URLs to point to your running backend.

### 5. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Database initialization and migrations must be completed according to the Prisma configuration before using the application.

## Security

- Passwords are hashed before storage.
- Authentication uses HTTP-only cookies.
- Protected operations require authentication and appropriate room membership.
- Environment variables and secrets should never be committed to the repository.

## Project Purpose

This project was built as a portfolio project to demonstrate full-stack development, real-time communication, authentication, database integration, and maintainable application architecture.

## Author

**Soosan Arabdashti**

GitHub: [@soosan1365](https://github.com/soosan1365)