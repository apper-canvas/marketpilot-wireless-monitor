import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
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

  const NavItem = ({ item, isActive }) => (
    <NavLink
      to={item.path}
      className={cn(
        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
        "hover:bg-white/10 hover:backdrop-blur-sm",
        isActive 
          ? "bg-white/20 text-white shadow-lg backdrop-blur-sm" 
          : "text-white/80 hover:text-white"
      )}
    >
      <ApperIcon 
        name={item.icon} 
        className={cn(
          "flex-shrink-0 w-5 h-5 transition-colors duration-200",
          isCollapsed ? "mx-auto" : "mr-3"
        )}
      />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="truncate">{item.name}</div>
          <div className="text-xs text-white/60 truncate">{item.description}</div>
        </div>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 gradient-bg",
        isCollapsed && "lg:w-20"
      )}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center px-6 py-6">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-display">MarketPilot</h1>
                  <p className="text-xs text-white/70">AI Marketing Hub</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mx-auto">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
            )}
            
            <button
              onClick={onToggle}
              className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <ApperIcon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                className="w-4 h-4 text-white/80" 
              />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
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
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;