/**
 * Sidebar Component
 * 
 * This component renders a collapsible sidebar navigation menu with the following features:
 * - Displays navigation links defined in the routes configuration
 * - Highlights the active route based on current location
 * - Can be collapsed/expanded with a toggle button
 * - Shows tooltips for navigation items when collapsed
 * - Smooth transition animations when collapsing/expanding
 */
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { routes } from '@/lib/utils';


const Sidebar = () => {
  // Get current route location to highlight active menu item
  const location = useLocation();
  // State to track whether sidebar is collapsed
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`relative h-screen bg-white border-r border-gray-200 fixed left-0 top-0 pt-2 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle button to collapse/expand the sidebar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </button>

      {/* Navigation menu items */}
      <div className="flex flex-col p-4 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = location.pathname === route.path;
          return (
            <div key={route.path} className="relative group">
              {/* Navigation link with conditional styling based on active state */}
              <Link
                to={route.path}
                className={`flex items-center ${!isCollapsed ? 'space-x-3' : 'justify-center'} px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-600'} />
                {/* Only show text labels when sidebar is expanded */}
                {!isCollapsed && <span className="font-medium">{route.name}</span>}
              </Link>

              {/* Tooltip that appears on hover when sidebar is collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block">
                  <div className="bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                    {route.name}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar; 