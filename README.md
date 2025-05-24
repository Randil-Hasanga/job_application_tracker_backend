# Job Application Tracker Backend

A backend API built with [NestJS](https://nestjs.com/) for managing job applications, user authentication (including Google OAuth), and AI-powered text extraction for job descriptions.

## Features

- User authentication (Google OAuth and email/password)
- Session management with MongoDB-backed sessions
- CRUD operations for job applications
- AI-powered extraction of company and role from job descriptions using OpenRouter API
- Modular structure with NestJS best practices
- Environment-based configuration

## Project Structure

```
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
  application/
    application.controller.ts
    application.module.ts
    application.service.ts
    dto/
    entities/
  auth/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    entities/
    utils/
  text-generator/
    text-generator.controller.ts
    text-generator.module.ts
    text-generator.service.ts
  utils/
.env.example
```

## Getting Started

### Prerequisites

- Node.js 22.x
- MongoDB instance
- [OpenRouter API key](https://openrouter.ai/)
- Google OAuth credentials

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
redirect_uris=http://localhost:3000/auth/google/redirect
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The server will run on the port specified in your `.env` or default to 3000.

## API Overview

### Authentication

- `POST /auth/register` — Register with email and password
- `POST /auth/login` — Login with email and password
- `GET /auth/google/login` — Google OAuth login
- `GET /auth/google/redirect` — Google OAuth callback
- `GET /auth/user` — Get current authenticated user
- `GET /auth/logout` — Logout

### Applications

- `POST /application` — Create a new job application (authenticated)
- `GET /application` — List all applications for the user (authenticated)
- `GET /application/:id` — Get a specific application (authenticated)
- `PATCH /application/:id` — Update an application (authenticated)
- `DELETE /application/:id` — Delete an application (authenticated)

### Text Generator

- `POST /text-generator` — Extract company and role from a job description (authenticated)

  **Request body:**
  ```json
  { "description": "Job description text here" }
  ```

  **Response:**
  ```json
  {
    "company": "Company Name",
    "role": "Role Title",
    "dateApplied": "YYYY-MM-DD",
    "status": "Applied"
  }
  ```

## Testing

```bash
npm run test
```

## Deployment

- The project is ready for deployment on platforms like Vercel or Heroku.
- See [vercel.json](vercel.json) for Vercel configuration.
- Use the provided `Procfile` for Heroku.

## License

This project is UNLICENSED and for personal or educational use only.