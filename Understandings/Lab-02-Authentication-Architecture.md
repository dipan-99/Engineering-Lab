# Lab 02 — Authentication Architecture

## Architecture

```text
React Frontend
      ↓
Axios API
      ↓
Express Routes
      ↓
Customer Controller
      ↓
Customer Model
      ↓
MongoDB
```

Authentication is handled using **JWT stored in an HttpOnly cookie**.

### Main components

- `customer.model.js` — stores customer information.
- `customer.controller.js` — register, login, profile, logout and password logic.
- `customer.routes.js` — authentication endpoints.
- `auth.middleware.js` — verifies the JWT and identifies the logged-in customer.
- `generateToken.js` — creates the JWT.
- React pages include `Register`, `Login` and `Home`.

## Main API Flow

```text
Register
POST /customers/register
        ↓
Validate user
        ↓
Hash password
        ↓
Save Customer
        ↓
Response
```

```text
Login
POST /customers/login
        ↓
Find customer
        ↓
Compare password
        ↓
Generate JWT
        ↓
Set HttpOnly cookie
        ↓
Login successful
```

Protected requests:

```text
Frontend
   ↓
Request + Cookie
   ↓
auth.middleware
   ↓
Verify JWT
   ↓
req.user
   ↓
Controller
```

The browser automatically sends the cookie with authenticated requests when credentials are enabled.
