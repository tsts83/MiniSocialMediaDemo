# **Social App Backend 🚀**
A backend API for a social media app with **authentication, user posts, and testing** using **Node.js, Express, MongoDB, and JWT authentication**.

---

## **📌 Features**
- ✅ User Authentication (Register/Login with JWT)  
- ✅ Create, Read, and Manage Posts  
- ✅ Swagger API Documentation  
- ✅ Unit & Integration Testing with Jest & Supertest  
- ✅ Uses MongoDB Atlas for Cloud Database  

## 2️⃣ Install Dependencies

First, clone the repository:

```bash
git clone https://github.com/your-username/social-app-backend.git
cd social-app-backend
```


Install the required dependencies using npm:

```bash
npm install
```

Make sure to create a .env file in the root directory of your project and add the following environment variables:

```env
MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-jwt-secret
PORT=5002
```

## 3️⃣ Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the server on the port specified in the .env file (default is 5002). You can access the API at: 
```bash
http://localhost:5002
```

The application uses MongoDB as the database, and the connection string is pulled from the environment variable MONGO_URI.

You can also access the Swagger API documentation at:
```bash
http://localhost:5002/api-docs
http://localhost:5002/swagger.json
```

Running in Production
To run the application in production, use the following command:
```bash
npm start
```
Make sure to set the environment variable NODE_ENV=production in your .env file or through your hosting provider.

