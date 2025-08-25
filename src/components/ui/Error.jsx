import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  variant = "default" 
}) => {
  const getErrorIcon = () => {
    switch (variant) {
      case "connection":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "permission":
        return "Shield";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (variant) {
      case "connection":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "permission":
        return "Access Denied";
      default:
        return "Error";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <ApperIcon 
            name={getErrorIcon()} 
            className="w-8 h-8 text-red-500" 
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getErrorTitle()}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          If this problem persists, please contact support.
        </div>
      </div>
    </div>
  );
};

export default Error;