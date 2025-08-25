import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item",
  action,
  actionText = "Get Started",
  icon = "Inbox",
  variant = "default"
}) => {
  const getEmptyContent = () => {
    switch (variant) {
      case "campaigns":
        return {
          icon: "Megaphone",
          title: "No campaigns yet",
          description: "Create your first marketing campaign to start tracking performance and generating insights.",
          actionText: "Create Campaign"
        };
      case "content":
        return {
          icon: "FileText",
          title: "No content drafts",
          description: "Use our AI-powered content generator to create compelling ad copy, social posts, and emails.",
          actionText: "Generate Content"
        };
      case "alerts":
        return {
          icon: "Bell",
          title: "No alerts",
          description: "All your campaigns are performing well! We'll notify you when something needs attention.",
          actionText: "Configure Alerts"
        };
      case "reports":
        return {
          icon: "BarChart3",
          title: "No reports generated",
          description: "Create custom reports to share insights with your team and clients.",
          actionText: "Create Report"
        };
      case "accounts":
        return {
          icon: "Link",
          title: "No accounts connected",
          description: "Connect your marketing accounts to start centralizing your campaigns and analytics.",
          actionText: "Connect Accounts"
        };
      default:
        return {
          icon,
          title,
          description,
          actionText
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
          <ApperIcon 
            name={content.icon} 
            className="w-10 h-10 text-primary-500" 
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {content.description}
        </p>
        
        {action && (
          <button
            onClick={action}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span className="font-medium">{content.actionText}</span>
          </button>
        )}
        
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Shield" className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;