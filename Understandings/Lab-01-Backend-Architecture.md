# Lab 01 — Backend Architecture

## Architecture

```text
Client / Postman
      ↓
Express Server (8082)
      ↓
Routes
      ↓
Controllers
      ↓
Mongoose Models
      ↓
MongoDB Atlas
```

The first lab establishes the backend foundation using **Node.js + Express + MongoDB/Mongoose**.

### Main responsibilities

- Express creates the HTTP server.
- Routes decide which controller handles a request.
- Controllers contain business logic.
- Mongoose models define MongoDB data structures.
- `.env` stores configuration such as the MongoDB connection string.
- CORS allows the React frontend to communicate with the backend.

## Flow

```text
Request
  ↓
Express
  ↓
Route
  ↓
Controller
  ↓
Model
  ↓
MongoDB
  ↓
Response
```

The backend is separated into layers so routing, business logic, and database logic are not mixed together.
