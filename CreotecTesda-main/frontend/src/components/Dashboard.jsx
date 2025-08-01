import React from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4 text-white flex space-x-6">
        <NavLink
          to="/generate"
          className={({ isActive }) =>
            isActive ? 'underline font-bold' : 'hover:underline'
          }
        >
          Generate
        </NavLink>

        <NavLink
          to="/tesda"
          className={({ isActive }) =>
            isActive ? 'underline font-bold' : 'hover:underline'
          }
        >
          TESDA
        </NavLink>

        {/* Add more links here as needed */}
      </nav>

      {/* Main content */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>
        {/* You can add dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
