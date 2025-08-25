import React, { useState } from "react";
import KPIGrid from "@/components/organisms/KPIGrid";
import AlertCenter from "@/components/organisms/AlertCenter";
import CampaignOverview from "@/components/organisms/CampaignOverview";
import AIContentGenerator from "@/components/organisms/AIContentGenerator";

const Dashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Marketing Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered insights and campaign performance overview
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPI Overview */}
      <KPIGrid 
        accountId={selectedAccount} 
        dateRange={dateRange} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Overview */}
          <CampaignOverview limit={5} />
          
          {/* AI Content Generator */}
          <AIContentGenerator />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Smart Alerts */}
          <AlertCenter limit={5} />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-lg">🚀</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Create Campaign</div>
                  <div className="text-xs text-gray-500">Launch new marketing campaign</div>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                  <span className="text-accent-600 text-lg">✨</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Generate Content</div>
                  <div className="text-xs text-gray-500">AI-powered content creation</div>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📊</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Create Report</div>
                  <div className="text-xs text-gray-500">Generate performance report</div>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">🔗</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Connect Account</div>
                  <div className="text-xs text-gray-500">Add marketing platform</div>
                </div>
              </button>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <div>
                  <p className="text-sm text-blue-900 font-medium">Optimization Tip</p>
                  <p className="text-xs text-blue-700 mt-1">Your LinkedIn campaigns are performing 23% better on weekdays. Consider increasing weekday budgets.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-green-900 font-medium">Audience Insight</p>
                  <p className="text-xs text-green-700 mt-1">25-34 age group shows highest conversion rates. Expand targeting for this demographic.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-sm">⚡</span>
                </div>
                <div>
                  <p className="text-sm text-yellow-900 font-medium">Budget Alert</p>
                  <p className="text-xs text-yellow-700 mt-1">Q4 holiday campaigns are approaching. Consider increasing budgets by 15-20%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;