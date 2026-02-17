
import React from 'react';
import { ICONS } from '../constants';
// Fix: Import ViewState from the correct file
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  userRole: 'user' | 'admin';
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, userRole }) => {
  const navItems = [
    { id: 'HOME', label: 'Home', icon: <ICONS.Location /> },
    { id: 'DASHBOARD', label: 'My Bookings', icon: <ICONS.Charging /> },
    { id: 'VEHICLES', label: 'My Vehicles', icon: <ICONS.Car /> },
    { id: 'ROADMAP', label: 'Trip Planner', icon: <ICONS.Route /> },
    ...(userRole === 'admin' ? [{ id: 'ADMIN', label: 'Admin', icon: <ICONS.Admin /> }] : []),
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">Eva Electrical</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <ICONS.User />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">John Doe</p>
              <p className="text-gray-400 text-xs">Premium User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`flex flex-col items-center space-y-1 ${
              activeView === item.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mb-20 md:mb-0">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find(i => i.id === activeView)?.label}
          </h1>
          <div className="flex space-x-3">
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
               </svg>
             </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;