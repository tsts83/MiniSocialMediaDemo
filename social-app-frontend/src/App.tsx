import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
      <div className="app-container">
        <header className="navbar">
          <h1 className="logo">Social App</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<h2 className="page-title">Welcome to Social App</h2>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
  );
};

export default App;
