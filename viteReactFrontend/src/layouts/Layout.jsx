import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom"; // ← Import this
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./SideBar";

const Layout = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation(); // ← Get current route

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/users/login";
  const isRegister = location.pathname === "/users/register"; // ← Check for homepage

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 w-full">
      <Navbar />

      <div className="flex min-h-screen">
        {/* ✅ Show Sidebar only if NOT on homepage */}
        {!isHomePage && !isLoginPage && !isRegister && <Sidebar/> }

        <main className="flex-1 px-4 py-6 w-full">{children}</main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
