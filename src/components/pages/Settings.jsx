import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "Your Company",
      timezone: "America/New_York",
      currency: "USD",
      dateFormat: "MM/dd/yyyy"
    },
    notifications: {
      emailAlerts: true,
      slackIntegration: false,
      dailyReports: true,
      weeklyReports: true,
      budgetAlerts: true,
      performanceAlerts: true
    },
    ai: {
      autoOptimization: true,
      contentGeneration: true,
      budgetRecommendations: true,
      audienceInsights: true,
      tone: "professional",
      creativity: "balanced"
    },
    team: {
      members: [
        { id: 1, name: "John Smith", email: "john@company.com", role: "Admin", status: "active" },
        { id: 2, name: "Sarah Johnson", email: "sarah@company.com", role: "Manager", status: "active" },
        { id: 3, name: "Mike Chen", email: "mike@company.com", role: "Analyst", status: "pending" }
      ]
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "ai", label: "AI Settings", icon: "Brain" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "billing", label: "Billing", icon: "CreditCard" },
    { id: "security", label: "Security", icon: "Shield" }
  ];

  const handleSaveSettings = (section) => {
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
  };

  const handleToggleNotification = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleToggleAISetting = (key) => {
    setSettings({
      ...settings,
      ai: {
        ...settings.ai,
        [key]: !settings.ai[key]
      }
    });
  };

  const renderGeneralSettings = () => (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          General Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={settings.general.companyName}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, companyName: e.target.value }
            })}
          />
          
          <Select
            label="Timezone"
            value={settings.general.timezone}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, timezone: e.target.value }
            })}
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
          </Select>
          
          <Select
            label="Default Currency"
            value={settings.general.currency}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, currency: e.target.value }
            })}
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
          </Select>
          
          <Select
            label="Date Format"
            value={settings.general.dateFormat}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, dateFormat: e.target.value }
            })}
          >
            <option value="MM/dd/yyyy">MM/DD/YYYY</option>
            <option value="dd/MM/yyyy">DD/MM/YYYY</option>
            <option value="yyyy-MM-dd">YYYY-MM-DD</option>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings("general")}>
          Save Changes
        </Button>
      </div>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          Notification Preferences
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Alert Notifications</h4>
            <div className="space-y-3">
              {Object.entries({
                emailAlerts: "Email Alerts",
                budgetAlerts: "Budget Threshold Alerts",
                performanceAlerts: "Performance Anomaly Alerts"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{label}</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Get notified when {label.toLowerCase()} occur
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      settings.notifications[key] ? "bg-primary-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Report Schedule</h4>
            <div className="space-y-3">
              {Object.entries({
                dailyReports: "Daily Performance Summary",
                weeklyReports: "Weekly Analytics Report"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{label}</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Automatically generated {label.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      settings.notifications[key] ? "bg-primary-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings("notifications")}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );

  const renderAISettings = () => (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
          AI Configuration
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">AI Features</h4>
            <div className="space-y-3">
              {Object.entries({
                autoOptimization: "Automatic Campaign Optimization",
                contentGeneration: "AI Content Generation",
                budgetRecommendations: "Smart Budget Recommendations",
                audienceInsights: "AI Audience Analysis"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{label}</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Enable {label.toLowerCase()} features
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAISetting(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      settings.ai[key] ? "bg-primary-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.ai[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Default Content Tone"
              value={settings.ai.tone}
              onChange={(e) => setSettings({
                ...settings,
                ai: { ...settings.ai, tone: e.target.value }
              })}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="urgent">Urgent & Direct</option>
              <option value="inspirational">Inspirational</option>
              <option value="humorous">Light & Humorous</option>
            </Select>
            
            <Select
              label="AI Creativity Level"
              value={settings.ai.creativity}
              onChange={(e) => setSettings({
                ...settings,
                ai: { ...settings.ai, creativity: e.target.value }
              })}
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="creative">Creative</option>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings("ai")}>
          Save AI Settings
        </Button>
      </div>
    </Card>
  );

  const renderTeamSettings = () => (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 font-display">
          Team Management
        </h3>
        <Button icon="UserPlus" size="sm">
          Invite Member
        </Button>
      </div>
      
      <div className="space-y-4">
        {settings.team.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
                <p className="text-xs text-gray-600">{member.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge
                variant={member.status === "active" ? "success" : "warning"}
                size="sm"
              >
                {member.status}
              </Badge>
              
              <Badge variant="outline" size="sm">
                {member.role}
              </Badge>
              
              <Button size="sm" variant="ghost" icon="MoreHorizontal" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderBillingSettings = () => (
    <Card className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 font-display">
        Billing & Usage
      </h3>
      
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Pro Plan</h4>
            <p className="text-sm text-gray-600">Unlimited campaigns and AI features</p>
          </div>
          <Badge variant="success" size="lg">Active</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Monthly Cost:</span>
            <div className="text-lg font-bold text-gray-900">$99/month</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Next Billing:</span>
            <div className="text-lg font-bold text-gray-900">Dec 15, 2024</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Usage:</span>
            <div className="text-lg font-bold text-gray-900">67% of limits</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-medium text-gray-900">Payment Method</h4>
          <p className="text-sm text-gray-600">•••• •••• •••• 4242 (Visa)</p>
        </div>
        <Button variant="outline" size="sm">
          Update Payment
        </Button>
      </div>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 font-display">
        Security Settings
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-xs text-gray-600 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable 2FA
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">API Access</h4>
            <p className="text-xs text-gray-600 mt-1">
              Manage API keys and third-party integrations
            </p>
          </div>
          <Button variant="outline" size="sm">
            Manage Keys
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Session Management</h4>
            <p className="text-xs text-gray-600 mt-1">
              View and manage active sessions
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Sessions
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralSettings();
      case "notifications": return renderNotificationSettings();
      case "ai": return renderAISettings();
      case "team": return renderTeamSettings();
      case "billing": return renderBillingSettings();
      case "security": return renderSecuritySettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences, AI configuration, and team settings
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-800 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;