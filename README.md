# Tourism Application

A microservices-based tourism booking platform built with Spring Boot, Spring Cloud Gateway, React, MySQL, Docker, and Docker Compose.

## Architecture

This repository contains a multi-module application with the following components:

- `Backend/auth-service` – authentication service with JWT support
- `Backend/booking-service` – booking management service
- `Backend/destination-service` – destination management service
- `Backend/packages-service` – travel package management service
- `Backend/api-gateway` – Spring Cloud Gateway routing all API traffic through a single entry point
- `Frontend` – React frontend that consumes the API gateway
- `mysql-init` – MySQL initialization scripts for database bootstrapping

## Technology Stack

- Java 17
- Spring Boot 3.x
- Spring Cloud Gateway
- Spring Data JPA
- MySQL 8
- Flyway migrations
- React 18
- Docker & Docker Compose
- JWT authentication

## Ports

- `8080` – API Gateway
- `8081` – Auth service
- `8082` – Booking service
- `8083` – Destination service
- `8084` – Packages service
- `3000` – Frontend served by Nginx via Docker
- `3306` – MySQL database

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Java 17 (for local backend development)
- Node.js and npm (for local frontend development)

### Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

This will build all services and launch:

- MySQL
- auth-service
- booking-service
- destination-service
- packages-service
- api-gateway
- frontend

### Run production compose

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Environment

The root `.env` file contains application secrets used by Docker Compose:

```env
MYSQL_ROOT_PASSWORD=VERY_STRONG_PASSWORD
JWT_SECRET=VERY_LONG_RANDOM_SECRET
```

Update these values for your environment before running production deployments.

## Local Development

### Backend Services

Each backend service is a Spring Boot application in its own directory.

Example for the auth service:

```bash
cd Backend/auth-service
./mvnw spring-boot:run
```

On Windows:

```powershell
cd Backend\auth-service
./mvnw.cmd spring-boot:run
```

Repeat for `booking-service`, `destination-service`, `packages-service`, and `api-gateway`.

### Frontend

Install dependencies and start the React application:

```bash
cd Frontend
npm install
npm start
```

To create a production build:

```bash
npm run build
```

## Service Endpoints

The frontend is configured to use the API Gateway at:

- `http://localhost:8080`

Gateway routes forward requests to the backend services:

- `/api/auth/**` → `auth-service`
- `/api/bookings/**` → `booking-service`
- `/api/destinations/**` → `destination-service`
- `/api/packages/**` → `packages-service`

## Database Initialization

MySQL is seeded from `mysql-init/init.sql` on container startup. If you make changes to the initialization scripts, recreate the MySQL container:

```bash
docker compose down
docker compose up --build
```

## Build and Test

### Backend

Compile a backend service:

```bash
cd Backend/auth-service
./mvnw compile
```

Run tests:

```bash
./mvnw test
```

### Frontend

```bash
cd Frontend
npm test
```

## Notes

- The `Backend/api-gateway` service provides a common entry point for the frontend and handles routing to all backend microservices.
- The React app is built using `react-scripts` and served from the Docker container on port `3000`.
- Use `docker compose down` to stop the application stack.

## Troubleshooting

- If ports are already in use, stop the conflicting services or change the port mappings in `docker-compose.yml`.
- If MySQL fails to start, check that `3306` is free and verify the root password matches the `.env` file.
- If backend services cannot connect to MySQL, ensure `docker compose up` started the `mysql` service first and that the database containers have network access.

---

## Author

**Sithumini Anuhansi**

Software Engineering Undergraduate (NIBM)

[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:anuhansisithumini@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sithumini-anuhansi-5b32a8334)

---

<div align="right">
<img src="https://visitor-badge.laobi.icu/badge?page_id=Sithumini-Anuhansi.Tourism-Application&left_text=Views"/>
</div>
