import type React from "react";
import { Link } from "react-router-dom";
import icon from "../assets/logo.png";
import { useState } from "react";

function Header(): React.ReactElement {
  const [sideBar, setSideBar] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center pb-4 border-b-2 border-b-gray-200">
        <div className="flex items-center">
          <img
            src={icon}
            alt="TaskMaster Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="ml-2.5 text-lg font-bold text-gray-800">
            TaskMaster
          </span>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/features"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="/prices"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            to="/support"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Support
          </Link>
          <Link
            to="/login"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
        <div className="md:hidden z-10">
          <label className="btn btn-circle swap swap-rotate">
            <input type="checkbox" onClick={() => setSideBar(!sideBar)} />

            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </div>
      </div>

    <div
        className={`fixed right-0 top-0 min-h-screen min-w-[60%] bg-amber-400
    transition delay-150 duration-300 ease-in-out
    ${sideBar ? "translate-x-0" : "translate-x-full"}              
    z-5                                        
  `}
    ></div>
    </>
  );
}

export default Header;
