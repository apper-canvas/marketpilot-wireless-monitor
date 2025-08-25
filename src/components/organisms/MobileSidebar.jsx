import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      description: "Overview & KPIs"
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: "Megaphone", 
      description: "Manage campaigns"
    },
    {
      name: "Content Studio",
      path: "/content",
      icon: "FileText",
      description: "AI content generation"
    },
    {
      name: "Analytics",
      path: "/analytics", 
      icon: "BarChart3",
      description: "Performance insights"
    },
    {
      name: "Reports", 
      path: "/reports",
      icon: "FileBarChart",
      description: "Custom reports"
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: "Link",
      description: "Connected platforms"
    }
  ];

  const bottomNavigation = [
    {
      name: "Settings",
      path: "/settings",
      icon: "Settings",
      description: "App configuration"
    }
  ];

  const NavItem = ({ item, isActive, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        "hover:bg-white/10 hover:backdrop-blur-sm",
        isActive 
          ? "bg-white/20 text-white shadow-lg backdrop-blur-sm" 
          : "text-white/80 hover:text-white"
      )}
    >
      <ApperIcon 
        name={item.icon} 
        className="flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate">{item.name}</div>
        <div className="text-xs text-white/60 truncate">{item.description}</div>
      </div>
    </NavLink>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 w-80 gradient-bg z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-display">MarketPilot</h1>
                <p className="text-xs text-white/70">AI Marketing Hub</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 pb-4 space-y-1 border-t border-white/10 pt-4">
            {bottomNavigation.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;