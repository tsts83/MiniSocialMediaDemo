### Mini Social Media Demo
This is a simple Mini Social Media Application with full-stack functionality. It includes both frontend and backend code in the same repository. The backend API resides in the /api directory, and the frontend is in the root directory.

## Features
User registration and authentication (JWT-based)

Post creation, including text and image uploads (via Cloudinary)

Display posts and user details

Give likes to posts

Client-side interactions with the API

Responsive design using React.js

## Technologies Used
Frontend: React.js, Vite

Backend: Express.js

Database: MongoDB (via MongoDB Atlas)

Cloud Storage: Cloudinary (for image uploads)

Authentication: JWT (JSON Web Tokens)

## Setup
# 1. Clone the repository

git clone [https://github.com/yourusername/mini-social-media-demo.git
cd mini-social-media-demo
# 2. Backend Setup
Step 1: Install Backend Dependencies
Navigate to the /api folder and install the necessary dependencies for the backend:
```bash
cd api
npm install
```

Step 2: Start the Backend Server
From the /api directory, run:

```bash
npm run dev
```
This will start the backend on http://localhost:5002

# 3. Frontend Setup
Step 1: Install Frontend Dependencies
Navigate to the root directory and install the frontend dependencies:

```bash
cd ..
npm install
```

Step 2: Start the Frontend Development Server
In the root directory, run:

```bash
npm run dev
```

API Documentation
For detailed API documentation, you can access the Swagger UI at:

```bash
http://localhost:5002/api/api-docs
```

# 4. Live hosted site
The demo project is live and can be tested on the following link:
https://mini-social-media-demo.vercel.app/
( Hosted on Vercel )
