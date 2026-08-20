# Backend Ledger

A backend ledger-like banking system API. The project is currently in active development.

**Author:** Swarup Das  
**Current Date:** Tuesday, August 20, 2026  
**Project Day:** Day 4  
**Status:** Build in progress

## Current Progress

The project currently has the authentication foundation completed successfully. It includes user registration, user login, JWT-based access and refresh tokens, cookie-based authentication, password hashing, MongoDB connection setup, centralized error handling, and a protected health route.

Ledger-specific banking features such as accounts, balances, deposits, withdrawals, transfers, transaction history, and double-entry ledger records are not implemented yet.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- cookie-parser
- dotenv

## Folder Structure

The project currently follows a layered backend structure:

```txt
Backend-LEDGER/
+-- server.js
+-- package.json
+-- package-lock.json
+-- README.md
+-- .env
+-- .gitignore
+-- src/
    +-- app.js
    +-- config/
    |   +-- database.js
    +-- controllers/
    |   +-- auth.controller.js
    +-- middlewares/
    |   +-- auth.middleware.js
    |   +-- error.middleware.js
    +-- models/
    |   +-- auth.model.js
    +-- routes/
    |   +-- auth.routes.js
    +-- services/
    |   +-- auth.service.js
    +-- utils/
        +-- apiError.js
        +-- apiResponse.js
        +-- asyncHandler.js
        +-- token.js
```

## Architecture Status

- `server.js` starts the server and connects to MongoDB.
- `src/app.js` configures Express, JSON body parsing, cookies, routes, and global error middleware.
- `routes/` defines API endpoints.
- `controllers/` handles request and response logic.
- `services/` contains business logic and validation.
- `models/` contains Mongoose schemas and database models.
- `middlewares/` contains authentication and error handling middleware.
- `utils/` contains reusable helpers for API responses, API errors, async handling, and token generation.

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
```

## API Base URL

```txt
http://localhost:5000/api
```

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

Creates a new user account.

Request body:

```json
{
  "name": "Swarup Das",
  "email": "swarup@example.com",
  "password": "password123"
}
```

What it does:

- Validates `name`, `email`, and `password`.
- Checks if the user already exists.
- Hashes the password using bcrypt.
- Creates a new user in MongoDB.
- Generates access and refresh tokens.
- Stores the refresh token in the user document.
- Sends both tokens as HTTP-only secure cookies.

Success status:

```txt
201 Created
```

### Login User

```http
POST /api/auth/login
```

Logs in an existing user.

Request body:

```json
{
  "email": "swarup@example.com",
  "password": "password123"
}
```

What it does:

- Validates `email` and `password`.
- Finds the user by email.
- Compares the password with the hashed password stored in MongoDB.
- Generates a new access token and refresh token.
- Updates the refresh token in the user document.
- Sends both tokens as HTTP-only secure cookies.

Success status:

```txt
200 OK
```

### Refresh Access Token

```http
GET /api/auth/getRefresh
```

Generates a new access token using the refresh token.

What it does:

- Reads the `RefreshToken` cookie.
- Verifies the refresh token using JWT.
- Finds the user from the decoded token payload.
- Checks if the refresh token matches the token stored in the database.
- Generates a new access token.
- Sends the new access token as an HTTP-only secure cookie.

Success status:

```txt
200 OK
```

### Protected Health Check

```http
GET /api/auth/health
```

Checks if the user is authenticated.

What it does:

- Reads the `AccessToken` cookie.
- Verifies the access token using JWT.
- Finds the user by token payload.
- Excludes `password` and `refreshToken` from the returned user data.
- Returns authenticated user details.

Success status:

```txt
200 OK
```

## Security Implementation

### Password Hashing

Passwords are hashed using `bcrypt`.

Current implementation:

```js
bcrypt.hashSync(password, 10)
```

- Hashing happens inside the Mongoose `pre("save")` middleware.
- Salt rounds used: `10`.
- Password verification uses:

```js
bcrypt.compareSync(password, hashedPassword)
```

### Token System

Tokens are created using the `jsonwebtoken` package.

Access token:

- Cookie name: `AccessToken`
- JWT payload: `{ id: userId }`
- Secret: `process.env.ACCESS_SECRET`
- Expiry: `20M`
- Cookie max age: `20 minutes`
- Used for protected routes.

Refresh token:

- Cookie name: `RefreshToken`
- JWT payload: `{ id: userId }`
- Secret: `process.env.REFRESH_SECRET`
- Expiry: `1D`
- Cookie max age: `1 day`
- Stored in MongoDB on the user document.
- Used to generate a new access token.

Cookies are configured with:

```js
{
  httpOnly: true,
  secure: true
}
```

## User Model

Current user authentication model:

```txt
UserAuth
+-- name
+-- email
+-- password
+-- refreshToken
+-- createdAt
+-- updatedAt
```

Validation rules:

- `name` is required and must be at least 3 characters.
- `email` is required, unique, lowercase, trimmed, and must match email format.
- `password` is required and must be at least 6 characters.
- `refreshToken` stores the latest active refresh token.

## API Response Format

Successful responses use:

```json
{
  "success": true,
  "message": "Response message",
  "data": {}
}
```

Error responses use:

```json
{
  "message": "Error message"
}
```

## Run Project

Install dependencies:

```bash
npm install
```

Start production server:

```bash
npm start
```

Start development server:

```bash
npm run dev
```

## Development Notes

- Current completed module: Authentication.
- Current route group: `/api/auth`.
- Database connection is handled through Mongoose.
- Async controller errors are passed to centralized error middleware.
- No ledger transaction APIs are available yet.
- No automated tests are configured yet.
