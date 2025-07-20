import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButtton"; // ✅ Import the button

const Navbar = () => {
  const user = useSelector((state) => state.auth.user); // ✅ Get user from Redux

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">VideoHub</Link>

        <div className="space-x-4">
          {/* ✅ Show user profile link only if logged in */}
          {user && (
            <Link
              to="/users/current-user"
              className="text-gray-700 hover:text-blue-600"
            >
              @{user.username}
            </Link>
          )}

          {/* ✅ If not logged in, show auth links */}
          {!user && (
            <>
              <Link to="/users/register" className="text-gray-700 hover:text-blue-600">SignUp</Link>
              <Link to="/users/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            </>
          )}

          <Link to="/videos/" className="text-gray-700 hover:text-blue-600">All Videos</Link>

          {/* ✅ Show logout if logged in */}
          {user && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
