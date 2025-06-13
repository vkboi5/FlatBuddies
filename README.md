# Flatmates - Roommate Finder App

A MERN stack application that helps people find roommates and rooms using a Tinder-like interface.

## Features

- User authentication and profiles
- Tinder-like swiping interface
- Separate feeds for room seekers and room providers
- Matching system
- Real-time notifications
- Profile customization

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- Socket.io (for real-time features)
- JWT Authentication

## Project Structure

```
flatmates/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a .env file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Contributing

Feel free to submit issues and enhancement requests. 