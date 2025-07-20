import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-indigo-600 text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Video upload</h1>
          <p className="text-lg text-gray-300 mb-8">
            Enjoy unlimited free video uploads with <span className="text-blue-400 font-semibold">VideoHub</span>’s free hosting platform and securely manage all your videos in one location.
            Record your own video, or upload existing content. Easily share with others and control privacy settings.
          </p>
          <Link
            to="/users/register"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-full text-lg font-medium"
          >
            Sign In
          </Link>
        </div>

        {/* Image / Illustration */}
        <div className="flex-1">
          <img
            src="/videomaking.webp" // Replace this with the actual path
            alt="Video cloud illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
