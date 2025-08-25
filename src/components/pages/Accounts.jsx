import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import accountService from "@/services/api/accountService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await accountService.getAll();
      setAccounts(data);
    } catch (err) {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const availablePlatforms = [
    {
      id: "google_ads",
      name: "Google Ads",
      description: "Connect your Google Ads account for search and display campaign management",
      icon: "Search",
      color: "from-blue-500 to-blue-600",
      features: ["Search Campaigns", "Display Network", "Shopping Ads", "YouTube Ads"]
    },
    {
      id: "meta_ads",
      name: "Meta Business",
      description: "Connect Facebook and Instagram ads for social media marketing",
      icon: "Facebook",
      color: "from-indigo-500 to-indigo-600",
      features: ["Facebook Ads", "Instagram Ads", "Audience Network", "Messenger Ads"]
    },
    {
      id: "linkedin_ads",
      name: "LinkedIn Campaign Manager",
      description: "B2B marketing and professional audience targeting",
      icon: "Linkedin",
      color: "from-blue-600 to-blue-700",
      features: ["Sponsored Content", "Lead Gen Forms", "Message Ads", "Dynamic Ads"]
    },
    {
      id: "google_analytics",
      name: "Google Analytics 4",
      description: "Website analytics and conversion tracking",
      icon: "BarChart3",
      color: "from-orange-500 to-orange-600",
      features: ["Website Analytics", "Goal Tracking", "Audience Insights", "Attribution"]
    },
    {
      id: "search_console",
      name: "Google Search Console",
      description: "SEO insights and search performance data",
      icon: "Globe",
      color: "from-green-500 to-green-600",
      features: ["Search Performance", "Index Coverage", "Core Web Vitals", "Keyword Data"]
    },
    {
      id: "email_marketing",
      name: "Email Marketing",
      description: "Connect your email marketing platform",
      icon: "Mail",
      color: "from-purple-500 to-purple-600",
      features: ["Campaign Management", "List Segmentation", "Automation", "Analytics"]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "connected": return "success";
      case "error": return "error";
      case "syncing": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected": return "CheckCircle";
      case "error": return "AlertCircle";
      case "syncing": return "RefreshCw";
      default: return "Circle";
    }
  };

  const getPlatformIcon = (platform) => {
    const found = availablePlatforms.find(p => p.id === platform);
    return found ? found.icon : "Link";
  };

  const handleConnect = async (platformId) => {
    try {
      toast.info("Redirecting to authorization...");
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount = await accountService.create({
        platform: platformId,
        name: availablePlatforms.find(p => p.id === platformId)?.name || platformId,
        status: "connected",
        lastSync: new Date().toISOString(),
        credentials: "encrypted_token_data"
      });
      
      setAccounts([...accounts, newAccount]);
      setShowConnectModal(false);
      toast.success("Account connected successfully!");
    } catch (err) {
      toast.error("Failed to connect account");
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;
    
    try {
      await accountService.delete(accountId);
      setAccounts(accounts.filter(account => account.Id !== accountId));
      toast.success("Account disconnected successfully");
    } catch (err) {
      toast.error("Failed to disconnect account");
    }
  };

  const handleSync = async (accountId) => {
    try {
      const updatedAccount = await accountService.update(accountId, {
        status: "syncing",
        lastSync: new Date().toISOString()
      });
      
      setAccounts(accounts.map(account => 
        account.Id === accountId ? updatedAccount : account
      ));
      
      // Simulate sync process
      setTimeout(async () => {
        const finalAccount = await accountService.update(accountId, {
          status: "connected",
          lastSync: new Date().toISOString()
        });
        
        setAccounts(accounts.map(account => 
          account.Id === accountId ? finalAccount : account
        ));
        
        toast.success("Account synced successfully");
      }, 3000);
      
      toast.info("Syncing account data...");
    } catch (err) {
      toast.error("Failed to sync account");
    }
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAccounts} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Connected Accounts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your marketing platform connections and data synchronization
          </p>
        </div>
        
        <Button
          icon="Plus"
          size="lg"
          onClick={() => setShowConnectModal(true)}
        >
          Connect Account
        </Button>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {accounts.filter(a => a.status === "connected").length}
          </div>
          <div className="text-sm text-gray-600">Connected Accounts</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="RefreshCw" className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {accounts.filter(a => a.status === "syncing").length}
          </div>
          <div className="text-sm text-gray-600">Syncing</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {accounts.filter(a => a.status === "error").length}
          </div>
          <div className="text-sm text-gray-600">Need Attention</div>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            My Accounts ({accounts.length})
          </h3>
          <Button variant="outline" icon="RefreshCw" size="sm" onClick={loadAccounts}>
            Refresh All
          </Button>
        </div>

        {accounts.length === 0 ? (
          <Empty 
            variant="accounts"
            action={() => setShowConnectModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.Id} className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${availablePlatforms.find(p => p.id === account.platform)?.color || "from-gray-500 to-gray-600"} rounded-xl flex items-center justify-center`}>
                      <ApperIcon name={getPlatformIcon(account.platform)} className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {account.name}
                        </h4>
                        <Badge 
                          variant={getStatusColor(account.status)}
                          size="sm"
                        >
                          <div className="flex items-center space-x-1">
                            <ApperIcon 
                              name={getStatusIcon(account.status)} 
                              className={`w-3 h-3 ${account.status === "syncing" ? "animate-spin" : ""}`} 
                            />
                            <span className="capitalize">{account.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Platform: {account.platform}</span>
                        <span>
                          Last sync: {format(new Date(account.lastSync), "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon="RefreshCw"
                      onClick={() => handleSync(account.Id)}
                      disabled={account.status === "syncing"}
                    >
                      Sync
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      icon="Settings"
                    >
                      Settings
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Unlink"
                      onClick={() => handleDisconnect(account.Id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Connect New Account
              </h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Choose a platform to connect and start centralizing your marketing data.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <ApperIcon name={platform.icon} className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {platform.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {platform.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {platform.features.map((feature, index) => (
                            <Badge key={index} variant="outline" size="sm">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => handleConnect(platform.id)}
                      disabled={accounts.some(a => a.platform === platform.id)}
                    >
                      {accounts.some(a => a.platform === platform.id) ? "Already Connected" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;