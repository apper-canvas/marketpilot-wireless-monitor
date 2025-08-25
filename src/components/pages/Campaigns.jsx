import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import campaignService from "@/services/api/campaignService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "paused": return "warning";
      case "ended": return "default";
      case "draft": return "info";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return "Play";
      case "paused": return "Pause";
      case "ended": return "Square";
      case "draft": return "FileText";
      default: return "Circle";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "google": return "Search";
      case "facebook": return "Facebook";
      case "linkedin": return "Linkedin";
      case "twitter": return "Twitter";
      default: return "Globe";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuickAction = async (campaignId, action) => {
    try {
      let updatedStatus;
      switch (action) {
        case "pause":
          updatedStatus = "paused";
          break;
        case "resume":
          updatedStatus = "active";
          break;
        case "end":
          updatedStatus = "ended";
          break;
        default:
          return;
      }

      const updatedCampaign = await campaignService.update(campaignId, { status: updatedStatus });
      setCampaigns(campaigns.map(campaign => 
        campaign.Id === campaignId ? updatedCampaign : campaign
      ));
      toast.success(`Campaign ${action}d successfully`);
    } catch (err) {
      toast.error(`Failed to ${action} campaign`);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    const matchesPlatform = !platformFilter || campaign.accountId.includes(platformFilter);
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCampaigns} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Campaigns
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and optimize your marketing campaigns across all platforms
          </p>
        </div>
        
        <Button icon="Plus" size="lg">
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search campaigns..."
              onSearch={setSearchQuery}
              showFilters
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
              <option value="draft">Draft</option>
            </Select>
            
            <Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="min-w-[140px]"
            >
              <option value="">All Platforms</option>
              <option value="google">Google Ads</option>
              <option value="facebook">Meta Ads</option>
              <option value="linkedin">LinkedIn</option>
            </Select>
            
            <Button variant="outline" icon="Download" size="sm">
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Play" className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.filter(c => c.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Pause" className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.filter(c => c.status === "paused").length}
          </div>
          <div className="text-sm text-gray-600">Paused Campaigns</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Spend</div>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        {filteredCampaigns.length === 0 ? (
          <Empty 
            variant="campaigns"
            action={() => {}}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                All Campaigns ({filteredCampaigns.length})
              </h3>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" icon="RefreshCw" onClick={loadCampaigns}>
                  Refresh
                </Button>
                <Button size="sm" variant="outline" icon="Filter">
                  More Filters
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.Id} className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {campaign.name}
                        </h4>
                        <Badge 
                          variant={getStatusColor(campaign.status)}
                          size="sm"
                        >
                          <div className="flex items-center space-x-1">
                            <ApperIcon name={getStatusIcon(campaign.status)} className="w-3 h-3" />
                            <span className="capitalize">{campaign.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline" size="sm">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name={getPlatformIcon(campaign.accountId)} className="w-3 h-3" />
                            <span>{campaign.accountId}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {formatCurrency(campaign.budget)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Spend</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {formatCurrency(campaign.spend)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clicks</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {campaign.metrics?.clicks?.toLocaleString() || "0"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">CTR</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {campaign.metrics?.ctr ? `${campaign.metrics.ctr}%` : "0%"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Conversions</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {campaign.metrics?.conversions || "0"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span>Started: {format(new Date(campaign.startDate), "MMM dd, yyyy")}</span>
                        {campaign.endDate && (
                          <span>Ends: {format(new Date(campaign.endDate), "MMM dd, yyyy")}</span>
                        )}
                        <span>Last updated: {format(new Date(), "MMM dd, HH:mm")}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Budget Usage</span>
                          <span>{((campaign.spend / campaign.budget) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((campaign.spend / campaign.budget) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {campaign.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon="Pause"
                          onClick={() => handleQuickAction(campaign.Id, "pause")}
                        >
                          Pause
                        </Button>
                      )}
                      
                      {campaign.status === "paused" && (
                        <Button
                          size="sm"
                          variant="success"
                          icon="Play"
                          onClick={() => handleQuickAction(campaign.Id, "resume")}
                        >
                          Resume
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Edit"
                      >
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="MoreHorizontal"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Campaigns;