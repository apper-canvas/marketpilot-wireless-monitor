import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import campaignService from "@/services/api/campaignService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const CampaignOverview = ({ limit = null, showHeader = true }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await campaignService.getAll();
      const sortedCampaigns = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setCampaigns(limit ? sortedCampaigns.slice(0, limit) : sortedCampaigns);
    } catch (err) {
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [limit]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "paused": return "warning";
      case "ended": return "default";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return "Play";
      case "paused": return "Pause";
      case "ended": return "Square";
      default: return "Circle";
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCampaigns} />;
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <Empty 
          variant="campaigns"
          action={() => window.location.href = "/campaigns"}
        />
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Recent Campaigns
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              icon="RefreshCw"
              onClick={loadCampaigns}
            >
              Refresh
            </Button>
            {limit && campaigns.length >= limit && (
              <Button
                size="sm"
                variant="outline"
                icon="ExternalLink"
              >
                View All
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.Id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {campaign.name}
                  </h4>
                  <Badge 
                    variant={getStatusColor(campaign.status)}
                    size="sm"
                  >
                    <div className="flex items-center space-x-1">
                      <ApperIcon name={getStatusIcon(campaign.status)} className="w-3 h-3" />
                      <span>{campaign.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Budget:</span>
                    <div className="text-gray-900">{formatCurrency(campaign.budget)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Spend:</span>
                    <div className="text-gray-900">{formatCurrency(campaign.spend)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Clicks:</span>
                    <div className="text-gray-900">{campaign.metrics?.clicks || 0}</div>
                  </div>
                  <div>
                    <span className="font-medium">Conversions:</span>
                    <div className="text-gray-900">{campaign.metrics?.conversions || 0}</div>
                  </div>
                </div>
                
<div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span>Started: {campaign?.startDate && !isNaN(new Date(campaign.startDate).getTime())
                    ? format(new Date(campaign.startDate), "MMM dd, yyyy")
                    : "Unknown date"
                  }</span>
                  {campaign.endDate && !isNaN(new Date(campaign.endDate).getTime()) && (
                    <span>Ends: {format(new Date(campaign.endDate), "MMM dd, yyyy")}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-4">
                {campaign.status === "active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon="Pause"
                    onClick={() => handleQuickAction(campaign.Id, "pause")}
                  />
                )}
                
                {campaign.status === "paused" && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon="Play"
                    onClick={() => handleQuickAction(campaign.Id, "resume")}
                  />
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  icon="MoreHorizontal"
                />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
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
        ))}
      </div>
    </Card>
  );
};

export default CampaignOverview;