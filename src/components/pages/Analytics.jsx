import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import kpiService from "@/services/api/kpiService";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [platform, setPlatform] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await kpiService.getKPIs("", dateRange);
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, platform]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case "impressions": return "Eye";
      case "clicks": return "MousePointer";
      case "conversions": return "Target";
      case "revenue": return "DollarSign";
      case "ctr": return "TrendingUp";
      case "cpc": return "CreditCard";
      default: return "BarChart3";
    }
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnalytics} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Performance insights and data-driven recommendations for your campaigns
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          
          <Select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="">All Platforms</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Meta Ads</option>
            <option value="linkedin">LinkedIn</option>
          </Select>
          
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.slice(0, 4).map((metric) => (
          <Card key={metric.Id} className="text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name={getMetricIcon(metric.name.toLowerCase())} className="w-6 h-6 text-primary-600" />
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.type === "currency" ? formatCurrency(metric.value) : 
               metric.type === "percentage" ? `${metric.value.toFixed(1)}%` :
               new Intl.NumberFormat("en-US").format(metric.value)}
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              {metric.name}
            </div>
            
            <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
              <ApperIcon 
                name={metric.trend === "up" ? "TrendingUp" : metric.trend === "down" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4" 
              />
              <span>
                {metric.changePercent > 0 ? "+" : ""}{metric.changePercent}% vs last period
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Performance Overview
            </h3>
            <Button size="sm" variant="outline" icon="Settings">
              Configure
            </Button>
          </div>
          
          <div className="h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Chart visualization would be implemented here</p>
              <p className="text-sm">showing performance trends over time</p>
            </div>
          </div>
        </Card>

        {/* Channel Performance */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Channel Performance
            </h3>
            <Button size="sm" variant="outline" icon="Filter">
              Filter
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Google Ads", spend: 15420, conversions: 87, color: "from-blue-500 to-blue-600" },
              { name: "Meta Ads", spend: 12300, conversions: 64, color: "from-indigo-500 to-indigo-600" },
              { name: "LinkedIn", spend: 8900, conversions: 42, color: "from-purple-500 to-purple-600" },
              { name: "Twitter", spend: 4200, conversions: 18, color: "from-cyan-500 to-cyan-600" }
            ].map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${channel.color}`}></div>
                  <span className="font-medium text-gray-900">{channel.name}</span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Spend:</span> {formatCurrency(channel.spend)}
                  </div>
                  <div>
                    <span className="font-medium">Conv:</span> {channel.conversions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Detailed Performance Metrics
          </h3>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" icon="RefreshCw" onClick={loadAnalytics}>
              Refresh
            </Button>
            <Button size="sm" variant="outline" icon="Download">
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Current Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Previous Period</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Change</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((metric) => (
                <tr key={metric.Id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name={getMetricIcon(metric.name.toLowerCase())} className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{metric.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    {metric.type === "currency" ? formatCurrency(metric.value) : 
                     metric.type === "percentage" ? `${metric.value.toFixed(1)}%` :
                     new Intl.NumberFormat("en-US").format(metric.value)}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {metric.type === "currency" ? formatCurrency(metric.value * 0.85) : 
                     metric.type === "percentage" ? `${(metric.value * 0.85).toFixed(1)}%` :
                     new Intl.NumberFormat("en-US").format(Math.round(metric.value * 0.85))}
                  </td>
                  <td className={`py-4 px-4 text-right font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.changePercent > 0 ? "+" : ""}{metric.changePercent}%
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge 
                      variant={metric.trend === "up" ? "success" : metric.trend === "down" ? "error" : "default"}
                      size="sm"
                    >
                      <div className="flex items-center space-x-1">
                        <ApperIcon 
                          name={metric.trend === "up" ? "TrendingUp" : metric.trend === "down" ? "TrendingDown" : "Minus"} 
                          className="w-3 h-3" 
                        />
                        <span className="capitalize">{metric.trend}</span>
                      </div>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Brain" className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              AI-Powered Insights
            </h3>
            <p className="text-sm text-gray-600">
              Actionable recommendations based on your data
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Performance Opportunity</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your Google Ads campaigns show 23% higher conversion rates on mobile devices. 
                  Consider increasing mobile bid adjustments.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-blue-700 border-blue-200 hover:bg-blue-100">
                  Apply Recommendation
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Target" className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-900">Audience Insight</h4>
                <p className="text-sm text-green-700 mt-1">
                  The 25-34 age demographic has the highest lifetime value. 
                  Expand your targeting to similar audiences.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-green-700 border-green-200 hover:bg-green-100">
                  Create Lookalike Audience
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-900">Budget Optimization</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your LinkedIn campaigns are underspending by 15%. 
                  Consider reallocating budget from lower-performing channels.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                  Optimize Budget
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Clock" className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-purple-900">Timing Optimization</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Your ads perform 35% better between 9-11 AM and 2-4 PM. 
                  Adjust your ad scheduling for maximum impact.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-purple-700 border-purple-200 hover:bg-purple-100">
                  Update Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;