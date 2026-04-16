'use client';

import { useEffect, useState, useRef } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // check auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <h1 className="text-2xl font-bold text-gray-900">
          Job Tracker
        </h1>

        {/* RIGHT SIDE */}
        {isLoggedIn && (
          <div className="relative" ref={dropdownRef}>
            
            {/* AVATAR BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                U
              </div>
              <span className="text-sm font-medium text-gray-700">
                User
              </span>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">
                    Logged in
                  </p>
                  <p className="text-xs text-gray-500">
                    user@example.com
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}