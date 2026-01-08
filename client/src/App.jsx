import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import YourAssets from './pages/YourAssets';
import Warranties from './pages/Warranties';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Notifications from './components/Notifications';
import { useAuth } from './context/AuthContext';
import './App.css'; // This is where we'll put the new styles

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      {user && (
        <header>
          <nav>
            <h1>AssetWise</h1>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/assets">Your Assets</Link></li>
              <li><Link to="/warranties">Warranties</Link></li>
              <li><Notifications /></li>
              <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
          </nav>
        </header>
      )}

      {/* Add a <main> tag to wrap your page content */}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/assets" element={<YourAssets />} />
            <Route path="/warranties" element={<Warranties />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;