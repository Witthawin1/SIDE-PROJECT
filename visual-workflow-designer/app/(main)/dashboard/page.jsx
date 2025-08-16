"use client";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Calendar,
  User,
  CheckSquare,
  FileText,
  Table,
  FileImage,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

// Dashboard component with fixed transition
export default function DashBoard() {
  const [openMenus, setOpenMenus] = useState({
    dashboard: true,
    ecommerce: false,
    tasks: false,
    forms: false,
    tables: false,
    pages: false
  });

  // Function to toggle the state of a menu
  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">TailAdmin</h1>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* MENU Label */}
          <div className="px-6 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MENU</span>
          </div>

          {/* Dashboard */}
          <div className="px-3">
            <div 
              className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleMenu('dashboard')}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className="text-blue-600" />
                <span className="font-medium">Dashboard</span>
              </div>
              {openMenus.dashboard ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            
            <div className={`
              ml-9 mt-1 space-y-1 
              overflow-hidden
              transition-all duration-500 ease-in-out
              ${openMenus.dashboard ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <span>eCommerce</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>Analytics</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">PRO</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>Marketing</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">PRO</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>CRM</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">PRO</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>Stocks</span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">NEW</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">PRO</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>SaaS</span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">NEW</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">PRO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Other menu items... (unchanged) */}
          {/* Calendar */}
          <div className="px-3 mt-2">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Calendar size={18} className="text-gray-500" />
              <span className="font-medium">Calendar</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-3 mt-2">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <User size={18} className="text-gray-500" />
              <span className="font-medium">User Profile</span>
            </div>
          </div>

          {/* Tasks */}
          <div className="px-3 mt-2">
            <div 
              className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleMenu('tasks')}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className="text-gray-500" />
                <span className="font-medium">Task</span>
              </div>
              {openMenus.tasks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>

          {/* Forms */}
          <div className="px-3 mt-2">
            <div 
              className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleMenu('forms')}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-500" />
                <span className="font-medium">Forms</span>
              </div>
              {openMenus.forms ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>

          {/* Tables */}
          <div className="px-3 mt-2">
            <div 
              className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleMenu('tables')}
            >
              <div className="flex items-center gap-3">
                <Table size={18} className="text-gray-500" />
                <span className="font-medium">Tables</span>
              </div>
              {openMenus.tables ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>

          {/* Pages */}
          <div className="px-3 mt-2">
            <div 
              className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleMenu('pages')}
            >
              <div className="flex items-center gap-3">
                <FileImage size={18} className="text-gray-500" />
                <span className="font-medium">Pages</span>
              </div>
              {openMenus.pages ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>

          {/* SUPPORT Label */}
          <div className="px-6 mt-8 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SUPPORT</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100">
        <DashboardHeader />
        {/* Your main content goes here */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to TailAdmin</h2>
          <p className="text-gray-600">Your main dashboard content will go here.</p>
        </div>
      </div>
    </div>
  );
}

// Separate component for the header
function DashboardHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      {/* Left side - Menu and Search */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="relative">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-80">
            <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search or type command..." 
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
            <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded ml-2">⌘ K</span>
          </div>
        </div>
      </div>

      {/* Right side - Icons and Profile */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 10v-1a6 6 0 1 1 12 0v1m-7 4h2" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile dropdown */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">M</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Musharof</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
