import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo and App Name */}
      <Link to="/" className="flex items-center text-2xl font-bold">
        <img src={logo} alt="Review Nest Logo" className="h-10 w-10 mr-2" /> 
        Review Nest
      </Link>

      <div>
        {user ? (
          <>
            <Link to="/reviews" className="w-1/3 px-4 py-2 bg-gray-500 text-white rounded-xl mr-2 bg-gray-600 text-white px-4 py-2 rounded border-2 border-gray-600 transition-all duration-300 
                         hover:bg-gray-300 hover:text-gray-600">My Reviews</Link>
            <Link to="/profile" className="w-1/3 px-4 py-2 bg-gray-500 text-white rounded-xl mr-2 bg-gray-600 text-white px-4 py-2 rounded border-2 border-gray-600 transition-all duration-300 
                         hover:bg-gray-300 hover:text-gray-600">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="w-1/3 px-4 py-2 bg-gray-500 text-white rounded-xl mr-2 bg-gray-600 text-white px-4 py-2 rounded border-2 border-gray-600 transition-all duration-300 
                         hover:bg-gray-300 hover:text-gray-600"> Post a Review</Link>
            <Link
              to="/register"
              className="w-1/3 px-4 py-2 bg-gray-500 text-white rounded-xl mr-2 bg-gray-600 text-white px-4 py-2 rounded border-2 border-gray-600 transition-all duration-300 
                         hover:bg-gray-300 hover:text-gray-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;