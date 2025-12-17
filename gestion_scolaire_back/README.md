# School Management System - Backend

This is the backend for the School Management System, a web application for managing schools, students, professors, and administrators.

## Default Users

The application is configured to automatically create the following default users on startup:

1. **Administrator**
   - Email: admin@example.com
   - Password: password123
   - Role: ADMINISTRATOR

2. **Professor**
   - Email: professor@example.com
   - Password: password123
   - Role: PROFESSOR

3. **Student**
   - Email: student@example.com
   - Password: password123
   - Role: STUDENT

## How to Run the Application

1. Make sure you have Java 17 installed
2. Clone the repository
3. Navigate to the project directory
4. Run the application using Maven:
   ```
   mvn spring-boot:run
   ```
5. The application will start and create the default users automatically

## Accessing the H2 Database Console

To verify that the users have been created:

1. Go to http://localhost:8080/h2-console
2. Use the following connection details:
   - JDBC URL: jdbc:h2:mem:testdb
   - Username: sa
   - Password: (leave empty)
3. Click "Connect"
4. Run the following SQL query to see the users:
   ```sql
   SELECT * FROM users;
   ```

## Authentication and Authorization

The system uses JWT (JSON Web Token) for stateless authentication. There are three roles in the system:

- ADMINISTRATOR: Has full access to all features
- PROFESSOR: Has access to view students and other professors
- STUDENT: Has limited access to view their own information

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "role": "STUDENT"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john.doe@example.com",
  "role": "STUDENT"
}
```

### User Endpoints

#### Get all users (ADMINISTRATOR, PROFESSOR only)

```
GET /api/users
```

#### Get user by ID (All authenticated users)

```
GET /api/users/{id}
```

#### Create a new user (ADMINISTRATOR only)

```
POST /api/users
```

#### Delete a user (ADMINISTRATOR only)

```
DELETE /api/users/{id}
```

#### Find user by email (ADMINISTRATOR or the user themselves)

```
GET /api/users/by-email?email=john.doe@example.com
```

#### Check if a user exists by email (Public)

```
GET /api/users/exists-by-email?email=john.doe@example.com
```

## Security Configuration

The security configuration is set up to:

1. Use stateless JWT authentication
2. Allow CORS from any origin
3. Permit access to authentication endpoints without authentication
4. Require authentication for all other endpoints
5. Apply role-based authorization using Spring Security's @PreAuthorize annotations

## Integration with Angular Frontend

To integrate with an Angular frontend:

1. The frontend should store the JWT token in localStorage or sessionStorage
2. Include the token in the Authorization header for all API requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
   ```
3. Implement role-based UI components based on the user's role
4. Handle token expiration and refresh
