# **Social App Backend 🚀**
A backend API for a social media app with **authentication, user posts, and testing** using **Node.js, Express, MongoDB, and JWT authentication**.

---

## **📌 Features**
- ✅ User Authentication (Register/Login with JWT)  
- ✅ Create, Read, and Manage Posts  
- ✅ Swagger API Documentation  
- ✅ Unit & Integration Testing with Jest & Supertest  
- ✅ Uses MongoDB Atlas for Cloud Database  

---
2️⃣ Install Dependencies
sh
Másolás
Szerkesztés
npm install
3️⃣ Setup Environment Variables
Create a .env file in the root directory and add:

plaintext
Másolás
Szerkesztés
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/social_app?retryWrites=true&w=majority
TEST_MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
PORT=5002
🔹 Replace <username> and <password> with your MongoDB Atlas credentials.
🔹 The TEST_MONGO_URI should point to a separate test database.

🚀 Running the Server
For Development Mode (with Nodemon)
sh
Másolás
Szerkesztés
npm run dev
For Production Mode
sh
Másolás
Szerkesztés
npm start
Once running, the API will be available at:

arduino
Másolás
Szerkesztés
http://localhost:5002/
📖 API Documentation (Swagger)
You can access the Swagger API documentation at:

bash
Másolás
Szerkesztés
http://localhost:5002/api-docs
This allows you to test endpoints directly from your browser.

🧪 Running Tests
This project includes unit tests for authentication and posts.

Run Tests
sh
Másolás
Szerkesztés
npm test
📌 API Endpoints
🔹 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive a JWT token
🔹 Posts
Method	Endpoint	Description
POST	/api/posts	Create a post (Requires Auth)
GET	/api/posts	Get all posts
GET	/api/posts/:id	Get a single post by ID
DELETE	/api/posts/:id	Delete a post (Requires Auth)
🔹 Note: When making authenticated requests, send the JWT token in the Authorization header:

makefile
Másolás
Szerkesztés
Authorization: Bearer <your_token>
📜 Folder Structure
bash
Másolás
Szerkesztés
/social-app-backend
│── /models        # Mongoose schemas
│── /routes        # Express API routes
│── /tests         # Jest test files
│── server.js      # Main server entry point
│── .env           # Environment variables
│── .gitignore     # Ignore node_modules and .env
│── README.md      # Documentation
