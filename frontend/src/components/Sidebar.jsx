// src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom';
import { IconHome, IconWorld, IconList, IconMoon, IconSun, IconPlus } from '@tabler/icons-react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white shadow-2xl transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">Monitoring Hub</h1>
      </div>
      <nav className="mt-8 space-y-2 px-4">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <IconHome className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => navigate('/websites')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <IconWorld className="w-5 h-5" />
          <span>Websites</span>
        </button>
        <button
          onClick={() => navigate('/add-website')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <IconPlus className="w-5 h-5" />
          <span>Add Website</span>
        </button>
        <button
          onClick={() => navigate('/logs')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <IconList className="w-5 h-5" />
          <span>Logs</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {isDarkMode ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;