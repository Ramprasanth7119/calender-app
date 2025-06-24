import React from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 
                dark:hover:bg-gray-700 transition-colors shadow-sm"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <MdLightMode className="w-5 h-5 text-amber-500" />
      ) : (
        <MdDarkMode className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;