import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-telkom-red rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Inovasi <span className="telkom-red">Siswa</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Hi, {user.email.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="bg-telkom-red text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <a 
              href="#login" 
              className="bg-telkom-red text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
