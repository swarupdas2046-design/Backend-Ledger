# Backend Ledger

A backend ledger-style banking API built with Node.js, Express, MongoDB, and Mongoose.

**Author:** Swarup Das  
**Last Updated:** Saturday, August 22, 2026  
**Project Day:** Day 6  
**Status:** Build in progress

## Current Status

Backend Ledger now has the core foundation for a banking-style system:

- User authentication with register, login, refresh token, and protected route verification.
- Password hashing with bcrypt.
- JWT access and refresh token flow through HTTP-only secure cookies.
- Welcome email sent after successful registration.
- Account creation and account listing for authenticated users.
- Ledger-derived account balance calculation.
- Transaction creation with debit and credit ledger entries.
- MongoDB session-based transaction flow for money movement.
- Idempotency key handling to avoid duplicate transaction execution.
- System-user protected initial-funds transaction endpoint.
- Centralized async error handling and API response helpers.

The project is still in active development. It has a strong authentication, account, and transaction base, but it is not production-ready yet.

<!-- ## Remaining Work

- Add transaction history/list APIs.
- Add single transaction details API.
- Add account freeze, close, and status management APIs.
- Add deposit and withdrawal APIs if they should exist separately from transfer flow.
- Add transaction reversal/refund flow.
- Add stronger ownership checks for transfer `fromAccount`.
- Remove the temporary 15-second delay in transaction processing before production.
- Improve failed transaction handling and rollback reporting.
- Add request validation middleware.
- Add rate limiting and security headers.
- Add automated tests.
- Add API documentation collection, for example Postman or OpenAPI.
- Add production logging. -->

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Nodemailer
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
    |   +-- accounts.controller.js
    |   +-- auth.controller.js
    |   +-- transaction.controller.js
    +-- middlewares/
    |   +-- auth.middleware.js
    |   +-- error.middleware.js
    +-- models/
    |   +-- account.model.js
    |   +-- auth.model.js
    |   +-- ledger.model.js
    |   +-- transaction.model.js
    +-- routes/
    |   +-- account.route.js
    |   +-- auth.routes.js
    |   +-- transaction.route.js
    +-- services/
    |   +-- account.service.js
    |   +-- auth.service.js
    |   +-- mail.service.js
    |   +-- transaction.service.js
    +-- utils/
        +-- apiError.js
        +-- apiResponse.js
        +-- asyncHandler.js
        +-- emailTemplate.js
        +-- token.js
```

## Architecture

- `server.js` loads environment variables, connects MongoDB, and starts the server.
- `src/app.js` configures Express, JSON parsing, cookies, route mounting, and global error handling.
- `routes/` defines API endpoint groups.
- `controllers/` handles request/response flow.
- `services/` contains business logic.
- `models/` contains Mongoose schemas and database methods.
- `middlewares/` contains authentication and centralized error middleware.
- `utils/` contains reusable helpers for API responses, API errors, async handling, email templates, and token logic.

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
EMAIL_USER=your_gmail_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

## API Base URL

```txt
http://localhost:5000/api
```

## API Response Format

Success response:

```json
{
  "success": true,
  "message": "Response message",
  "data": {}
}
```

Error response:

```json
{
  "message": "Error message"
}
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

- Validates name, email, and password.
- Checks if the email already exists.
- Hashes the password using bcrypt.
- Creates the user in MongoDB.
- Generates access and refresh tokens.
- Stores the refresh token in the user document.
- Sends access and refresh tokens as HTTP-only secure cookies.
- Sends a welcome email to the new user.

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

- Validates email and password.
- Finds the user by email.
- Compares the password with the stored bcrypt hash.
- Generates a new access token and refresh token.
- Updates the stored refresh token.
- Sends both tokens as HTTP-only secure cookies.

### Refresh Access Token

```http
GET /api/auth/getRefresh
```

Generates a new access token using the refresh token cookie.

What it does:

- Reads the `RefreshToken` cookie.
- Verifies it with JWT.
- Finds the user from the decoded token payload.
- Confirms the cookie refresh token matches the stored refresh token.
- Sends a new `AccessToken` cookie.

### Protected Health Check

```http
GET /api/auth/health
```

Checks whether the current user is authenticated.

What it does:

- Reads the `AccessToken` cookie.
- Verifies it with JWT.
- Finds the user.
- Excludes password and refresh token from returned user data.
- Returns authenticated user details.

## Account APIs

All account routes require authentication through the `AccessToken` cookie.

### Create Account

```http
POST /api/accounts
```

Creates a new account for the logged-in user.

What it does:

- Verifies the user through `authMiddleware`.
- Creates an account linked to `req.user._id`.
- Uses default status `Active`.
- Uses default currency `INR`.

### Get User Accounts

```http
GET /api/accounts
```

Fetches all accounts that belong to the logged-in user.

What it does:

- Verifies the user.
- Finds all accounts where `user` equals the authenticated user's ID.
- Returns the account list.

### Get Account Balance

```http
GET /api/accounts/balance/:accountId
```

Fetches the current account balance.

What it does:

- Verifies the user.
- Confirms the account belongs to the authenticated user.
- Calculates balance from ledger entries.
- Balance formula: total `CREDIT` minus total `DEBIT`.

## Transaction APIs

### Create Transaction

```http
POST /api/transactions
```

Creates a transfer transaction between two accounts.

Request body:

```json
{
  "fromAccount": "source_account_id",
  "toAccount": "destination_account_id",
  "amount": 500,
  "idempotencyKey": "unique-transfer-key"
}
```

What it does:

- Requires authenticated user.
- Validates `fromAccount`, `toAccount`, `amount`, and `idempotencyKey`.
- Rejects negative transaction amounts.
- Checks both accounts exist.
- Checks whether the idempotency key was already used.
- Returns existing transaction status for duplicate idempotency keys.
- Requires both accounts to be `Active`.
- Calculates sender balance from ledger entries.
- Rejects the transaction if balance is insufficient.
- Starts a MongoDB session transaction.
- Creates the transaction as `PENDING`.
- Creates a `DEBIT` ledger entry for the source account.
- Creates a `CREDIT` ledger entry for the destination account.
- Marks the transaction as `COMPLETED`.
- Commits the MongoDB transaction.
- Sends a transaction notification email.

Current idempotency behavior:

- `COMPLETED`: returns the completed transaction.
- `PENDING`: returns processing status.
- `FAILED`: rejects with conflict.
- `REVERSED`: rejects with conflict.

### Create Initial Funds Transaction

```http
POST /api/transactions/system/initial-funds
```

Creates an initial-funds transfer from a system user account to another account.

Request body:

```json
{
  "toAccount": "destination_account_id",
  "amount": 1000,
  "idempotencyKey": "unique-initial-funds-key"
}
```

What it does:

- Requires `authSystemMiddleware`.
- Verifies the logged-in user has `systemUser: true`.
- Finds the destination account.
- Finds the system user's account.
- Starts a MongoDB session transaction.
- Creates a debit ledger entry from the system account.
- Creates a credit ledger entry to the destination account.
- Marks the transaction as `COMPLETED`.
- Commits the MongoDB transaction.

## Security Implementation

### Password Hashing

Passwords are hashed using `bcrypt`.

```js
bcrypt.hashSync(password, 10)
```

- Hashing runs in the Mongoose `pre("save")` middleware.
- Salt rounds: `10`.
- Password comparison uses:

```js
bcrypt.compareSync(password, hashedPassword)
```

### Token System

Tokens are created and verified with `jsonwebtoken`.

Access token:

- Cookie name: `AccessToken`
- Payload: `{ id: userId }`
- Secret: `process.env.ACCESS_SECRET`
- Expiry: `20M`
- Cookie max age: 20 minutes
- Used for protected routes.

Refresh token:

- Cookie name: `RefreshToken`
- Payload: `{ id: userId }`
- Secret: `process.env.REFRESH_SECRET`
- Expiry: `1D`
- Cookie max age: 1 day
- Stored on the user document.
- Used to generate a new access token.

Cookies are configured with:

```js
{
  httpOnly: true,
  secure: true
}
```

### System User Access

The user model includes:

```txt
systemUser: Boolean
```

- Default value: `false`.
- Immutable field.
- Hidden from normal queries with `select: false`.
- Used by `authSystemMiddleware` for system-only transaction routes.

## Email System

Email sending is implemented with Nodemailer using Gmail OAuth2.

Current emails:

- Welcome email after registration.
- Transaction notification after successful transfer.
- Transaction failed email template exists, but is not currently wired into the transaction failure flow.

The welcome email includes:

- HTML email layout.
- Plain text fallback.
- HTML-safe user name escaping.
- Modern banking-style visual theme.

## Data Models

### UserAuth

```txt
UserAuth
+-- name
+-- email
+-- password
+-- systemUser
+-- refreshToken
+-- createdAt
+-- updatedAt
```

### Account

```txt
Account
+-- user
+-- status
+-- currency
+-- createdAt
+-- updatedAt
```

Account rules:

- `user` references `UserAuth`.
- `status` can be `Active`, `Frozen`, or `Closed`.
- `currency` defaults to `INR`.
- Balance is derived from ledger entries, not stored directly.

### Transaction

```txt
Transaction
+-- fromAccount
+-- toAccount
+-- status
+-- amount
+-- idempotencyKey
+-- createdAt
+-- updatedAt
```

Transaction status values:

- `PENDING`
- `COMPLETED`
- `FAILED`
- `REVERSED`

### Ledger

```txt
Ledger
+-- account
+-- amount
+-- transaction
+-- type
+-- createdAt
+-- updatedAt
```

Ledger entry types:

- `DEBIT`
- `CREDIT`

Ledger rules:

- Ledger entries are immutable.
- Account, amount, transaction, and type cannot be changed after creation.
- Update and delete operations are blocked through Mongoose middleware.

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

- Current route groups: `/api/auth`, `/api/accounts`, `/api/transactions`.
- Database connection is handled through Mongoose.
- Transaction flow uses MongoDB sessions.
- Account balance is calculated from ledger entries.
- No automated tests are configured yet.
- The current `npm test` script is still a placeholder.
