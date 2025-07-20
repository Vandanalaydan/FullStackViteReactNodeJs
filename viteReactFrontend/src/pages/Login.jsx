// import LoginForm from "../components/forms/LoginForm";

// export default function Login() {
//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <LoginForm />
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm"; // Adjust path
//import animationImg from "../../public/"; // Replace with actual path

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0f172a] to-indigo-600 items-center justify-center p-10">
        <img
          src="/login.jpg"
          alt="Animation"
          className="max-w-full h-auto rounded-xl shadow-lg"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 py-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Login to continue to <span className="font-medium">VideoHub</span>
        </p>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <LoginForm />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/users/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    
  );
};

export default LoginPage;
