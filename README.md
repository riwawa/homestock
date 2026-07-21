# Homestock

A residential management system for tracking inventory, shopping lists, and purchase history — with support for multiple houses and multiple users per house.

## ✨ Features

- **Houses** — manage residences and residents
- **Products** — shared catalog with category, unit of measure, and minimum quantity
- **Inventory** — per-house stock control with configurable minimum thresholds
- **Shopping List** — auto-generated from low stock, or added manually
- **Purchases** — paginated history, registered directly from the shopping list
- **Trends** — monthly spend, spend by category, most purchased products, price variation over time
- **Authentication** — JWT-based login/register, multiple users per house (invite by email)

## Stack

**Backend**
- Java 21 · Spring Boot 3 · Spring Data JPA · Spring Security
- PostgreSQL · Flyway (migrations)
- JWT (jjwt) · BCrypt

**Frontend**
- React · TypeScript · Vite
- TanStack Query · React Hook Form · Zod
- React Router · Axios
- Vitest · Testing Library

## 📁 Structure

```
homestock/
├── backend/     # REST API (Spring Boot)
└── frontend/    # SPA (React + Vite)
```

Each domain follows a feature-based architecture on both sides:

```
backend/src/main/java/.../{house,product,inventory,shoppinglist,purchase,users}/
frontend/src/modules/{house,product,inventory,shoppinglist,purchase,auth}/
```

## Running locally

### Backend

```bash
cd backend
docker compose up --build
```

The API runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

**Backend** — `backend/src/main/resources/application-local.properties`:
```properties
jwt.secret=your-secret-key-here
```

**Frontend** — `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Tests

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npx vitest run
```

## 🏗️ Architecture

- **Backend**: DTOs kept separate from entities, dedicated mappers, business exceptions handled globally (`GlobalExceptionHandler`), house-scoped nested routes (`/api/houses/{houseId}/...`) with access verification via interceptor.
- **Frontend**: `Component → Hook (TanStack Query) → Service (Axios) → API`, Zod schemas as the single source of truth for forms, Context for session state (logged-in user, current house).

