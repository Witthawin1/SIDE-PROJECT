"use client";
import { useState } from 'react';
export default function Header() {
      // Use state to track whether the sidebar is open or closed.
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the state of the sidebar.
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost
        bg-transparent border-none shadow-none
        hover:rotate-90 hover:scale-125 transition duration-700"
        onClick={toggleSidebar} aria-label="Toggle sidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>{" "}
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl
        bg-transparent border-none shadow-none
        hover:scale-125 transition duration-700
        text-purple-800 font-bold" 
      >daisyUI</a>
      </div>
<div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-5 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>

          <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with a close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 transition-colors duration-300 rounded-md focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="p-4">
          <ul>
            <li className="my-2">
              <a href="#" className="block p-2 text-gray-700 transition-colors duration-300 rounded-md hover:bg-indigo-500 hover:text-white">
                Home
              </a>
            </li>
            <li className="my-2">
              <a href="#" className="block p-2 text-gray-700 transition-colors duration-300 rounded-md hover:bg-indigo-500 hover:text-white">
                About
              </a>
            </li>
            <li className="my-2">
              <a href="#" className="block p-2 text-gray-700 transition-colors duration-300 rounded-md hover:bg-indigo-500 hover:text-white">
                Services
              </a>
            </li>
            <li className="my-2">
              <a href="#" className="block p-2 text-gray-700 transition-colors duration-300 rounded-md hover:bg-indigo-500 hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* =======================
          Overlay for closing the sidebar by clicking outside
          ======================= */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 transition-opacity duration-300 bg-black opacity-70"
        ></div>
      )}
    </div>
  );
}
