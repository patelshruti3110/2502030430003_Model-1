# Portfolio Builder Backend

A complete backend API for the Portfolio Builder application built with Express.js and MongoDB.

## Features

- **User Authentication**: Signup and Login with JWT tokens
- **Portfolio Management**: Create and manage user portfolios
- **Project Management**: Add, update, and delete projects
- **MongoDB Integration**: Persistent data storage
- **CORS Enabled**: Easy frontend integration
- **Error Handling**: Comprehensive error responses

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure:
```
MONGODB_URI=mongodb://localhost:27017/portfolio_builder
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### User Routes (`/api/users`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Portfolio Routes (`/api/portfolio`)
- `POST /create` - Create/Update portfolio (protected)
- `GET /get` - Get user's portfolio (protected)
- `GET /user/:userId` - Get portfolio by user ID (public)

### Project Routes (`/api/projects`)
- `POST /add` - Add new project (protected)
- `GET /get` - Get user's projects (protected)
- `PUT /:id` - Update project (protected)
- `DELETE /:id` - Delete project (protected)
- `GET /all` - Get all projects (public)
- `GET /user/:userId` - Get projects by user ID (public)

## Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Portfolio.js
│   └── Project.js
├── controllers/         # Business logic
│   ├── userController.js
│   ├── portfolioController.js
│   └── projectController.js
├── routes/             # API routes
│   ├── userRoutes.js
│   ├── portfolioRoutes.js
│   └── projectRoutes.js
├── middleware/         # Custom middleware
│   └── auth.js        # JWT authentication
├── server.js          # Main server file
├── .env              # Environment variables
└── package.json      # Dependencies
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

## Example Requests

### Signup
```bash
POST http://localhost:5000/api/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Portfolio
```bash
POST http://localhost:5000/api/portfolio/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "role": "Full Stack Developer",
  "about": "Passionate developer...",
  "skills": "React,Node.js,MongoDB",
  "email": "john@example.com"
}
```

### Add Project
```bash
POST http://localhost:5000/api/projects/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Portfolio Website",
  "description": "Modern portfolio website...",
  "technologies": "React,Express,MongoDB",
  "githubLink": "https://github.com/...",
  "liveLink": "https://example.com",
  "imageUrl": "https://example.com/image.jpg"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (development/production) |

## Security Notes

- Always use a strong JWT_SECRET in production
- Keep `.env` file private and never commit it to version control
- Use HTTPS in production
- Implement rate limiting for production
- Validate all user inputs

## Contributing

Feel free to contribute to this project. Please follow best practices and maintain code quality.

## License

ISC
