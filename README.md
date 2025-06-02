# Book Finder

This project has two parts:
- `/Backend`: Node.js backend (Prisma, Express, etc.)
- `/Frontend`: Frontend application (Vue)

---


###  Prerequisites
- Node.js (v22+ recommended)
- A database (PostgreSQL, MySQL, etc.)
- `.env` configuration
---

##  Backend Setup

1. Go to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file with the following:

    ```
    APP_PORT=3000
    DATABASE_URL="" 
    JWT_SECRET_KEY=""
    GOOGLE_API_KEY=""
    ```
    For info on `DATABASE_URL`, see:<br>
    https://www.prisma.io/docs/orm/overview/databases

    For info on `GOOGLE_API_KEY`, see:<br>
    https://developers.google.com/books/docs/v1/getting_started?hl=pl

    For info on `JWT_SECRET_KEY`, see:<br>
    https://jwt.io/introduction

4. Edit schema.prisma file:
   ```
   datasource db {
      provider = 
      url      = env("DATABASE_URL")
   }
   ```
   For info on `provider`, see:<br>
   https://www.prisma.io/docs/orm/overview/databases

5. Generate Prisma client:

    ```bash
    npx prisma generate
    ```

6. Apply database migrations:

    ```bash
    npx prisma migrate deploy
    ```

7. Start the backend server:

    ```bash
    npm start
    ```

---
###  API Documentation

- API endpoints are documented using **Swagger**.
- Visit `/api-docs` while the server is running.
---
###  Testing

- Backend tests are written using **Jest**.
- To run tests in **backend** directory:

    ```bash
    npm test
    ```

---
##  Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

