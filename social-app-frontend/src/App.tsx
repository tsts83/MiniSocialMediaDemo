import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice"; // Import logout action
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import logo from "./assets/logo.png";

const AboutSection = () => {
  return (
    <div className="about-section">
      <h3>About This Project</h3>
      <p>
        This is a hobby project that I built to learn more about web development.
        It involves creating a simple social feed where users can post, like, and comment.
        I utilized the help of ChatGPT extensively to assist with the development process.
        The goal was to explore React, Redux, and API handling while creating something fun and engaging.
      </p>
      <p>
        I hope you enjoy using this project, and I plan to continue improving it in the future!
      </p>
    </div>
  );
};

const App = () => {
  const userToken = useSelector((state: any) => state.auth.token); // Check if user is logged in
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/")} // Make the logo clickable
        />
        <h1 className="logo" onClick={() => navigate("/")}>Sandor's Book</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          {!userToken ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-link">Logout</button>
          )}
          <Link to="/feed" className="nav-link">Feed</Link>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2 className="page-title">Welcome to SandorsBook, my Social App</h2>
                <AboutSection /> {/* Add the About section on the home page */}
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
