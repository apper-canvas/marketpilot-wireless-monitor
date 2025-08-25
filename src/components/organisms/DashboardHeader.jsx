import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";

const DashboardHeader = ({ 
  user = { name: "Marketing Team", avatar: null },
  accounts = [],
  selectedAccount,
  onAccountChange,
  onSearch
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text font-display">
              MarketPilot AI
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              AI-Powered Marketing Command Center
            </p>
          </div>
          
          {accounts.length > 0 && (
            <div className="hidden md:block">
              <Select
                value={selectedAccount}
                onChange={(e) => onAccountChange && onAccountChange(e.target.value)}
                className="min-w-[200px]"
              >
                <option value="">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.Id} value={account.Id}>
                    {account.name} ({account.platform})
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:block">
            <SearchBar
              placeholder="Search campaigns, content..."
              onSearch={onSearch}
              className="w-80"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
          >
            Create Campaign
          </Button>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
              <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Marketing Dashboard</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <ApperIcon name="Settings" className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <ApperIcon name="HelpCircle" className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;