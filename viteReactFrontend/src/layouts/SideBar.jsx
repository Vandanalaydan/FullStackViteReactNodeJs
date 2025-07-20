// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButtton";

import {
  Home,
  Rss,
  Clock,
  Video,
  ThumbsUp,
  Menu,
  Pencil,
  LogOut,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  const channelId = currentUser?._id;

  // Define nav items inside the component so you can use `subscriberId`
  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Subscriptions", path: "/subscriptions", icon: <Rss size={20} /> },
    {
      name: "Subscribers",
      path:  `/subscriptions/u/${channelId}` ,
      icon: <Rss size={20} />
    },
    { name: "Watch History", path: "/history", icon: <Clock size={20} /> },
    { name: "My Videos", path: "/videos/user/videos", icon: <Video size={20} /> },
    { name: "Liked Videos", path: "/likes/videos", icon: <ThumbsUp size={20} /> },
    { name: "Update Avatar", path: "/users/avatar", icon: <Pencil size={20} /> },
    { name: "Update CoverImage", path: "/users/coverImage", icon: <Pencil size={20} /> },
    { name: "Security", path: "/users/change-password", icon: <Settings size={20} /> },
    { name: <LogoutButton />, icon: <LogOut size={20} /> },
  ];

  return (
    <>
      {/* Hamburger button (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 m-2 fixed z-50 bg-gray-800 text-white rounded"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-md p-4 transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path
                  ? "bg-gray-200 font-semibold text-blue-600"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
