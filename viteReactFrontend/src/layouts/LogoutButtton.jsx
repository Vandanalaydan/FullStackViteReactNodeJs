// src/components/layout/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../store/apiSlice"; // ✅ correct import
import { clearCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const Navigate =useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap(); // call the API
      dispatch(clearCredentials()); // clear Redux store
     Navigate("/users/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800 font-semibold"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
