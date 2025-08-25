import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import competitorService from "@/services/api/competitorService";
import alertService from "@/services/api/alertService";
import { toast } from "react-toastify";

const CompetitorIntel = () => {
  const [competitors, setCompetitors] = useState([]);
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCreative, setSelectedCreative] = useState(null);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await competitorService.getAll();
      setCompetitors(data);
      setFilteredCompetitors(data);
    } catch (err) {
      setError("Failed to load competitor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompetitors();
  }, []);

  useEffect(() => {
    let filtered = competitors;

    if (searchTerm) {
      filtered = filtered.filter(competitor =>
        competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competitor.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPlatform !== "all") {
      filtered = filtered.filter(competitor =>
        competitor.platforms.includes(filterPlatform)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(competitor =>
        competitor.status === filterStatus
      );
    }

    setFilteredCompetitors(filtered);
  }, [competitors, searchTerm, filterPlatform, filterStatus]);

  const handleToggleAlert = async (competitorId, currentStatus) => {
    try {
      const updatedCompetitor = await competitorService.update(competitorId, {
        alertsEnabled: !currentStatus
      });
      
      setCompetitors(competitors.map(comp =>
        comp.Id === competitorId ? updatedCompetitor : comp
      ));

      if (!currentStatus) {
        await alertService.create({
          type: "competitor_new_ad",
          severity: "info",
          metric: "new_creative",
          threshold: 0,
          currentValue: 1,
          competitorId: competitorId,
          accountId: "system"
        });
      }

      toast.success(
        updatedCompetitor.alertsEnabled 
          ? "Competitor alerts enabled" 
          : "Competitor alerts disabled"
      );
    } catch (err) {
      toast.error("Failed to update alert settings");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'monitoring': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCompetitors} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Competitor Intelligence
          </h1>
          <p className="text-gray-600 mt-1">
            Track competitor ad spend, creative strategies, and market insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadCompetitors}
            disabled={loading}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => toast.info("Add competitor feature coming soon")}
          >
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search competitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Platforms</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="monitoring">Monitoring</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Database" className="w-4 h-4 mr-2" />
            {filteredCompetitors.length} competitors
          </div>
        </div>
      </Card>

      {/* Competitors Table */}
      {filteredCompetitors.length === 0 ? (
        <Card>
          <Empty 
            variant="competitors"
            action={() => window.location.reload()}
          />
        </Card>
      ) : (
        <Card padding="none">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platforms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Monthly Spend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threat Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creative Examples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompetitors.map((competitor) => (
                  <tr key={competitor.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {competitor.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {competitor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {competitor.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {competitor.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="outline"
                            size="sm"
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(competitor.estimatedSpend)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {competitor.spendTrend > 0 ? "+" : ""}{competitor.spendTrend}% vs last month
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {competitor.marketShare}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${competitor.marketShare}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={getSeverityColor(competitor.threatLevel)}
                        size="sm"
                      >
                        {competitor.threatLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {competitor.creativeExamples.slice(0, 3).map((creative, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-gray-200 rounded border-2 border-white flex items-center justify-center cursor-pointer hover:z-10"
                            onClick={() => setSelectedCreative(creative)}
                          >
                            <ApperIcon name="Image" className="w-4 h-4 text-gray-600" />
                          </div>
                        ))}
                        {competitor.creativeExamples.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{competitor.creativeExamples.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={competitor.alertsEnabled}
                          onChange={() => handleToggleAlert(competitor.Id, competitor.alertsEnabled)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          competitor.alertsEnabled 
                            ? 'bg-primary-600' 
                            : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform m-1 ${
                            competitor.alertsEnabled 
                              ? 'translate-x-4' 
                              : 'translate-x-0'
                          }`}></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Eye"
                          onClick={() => toast.info("Detailed analysis coming soon")}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Download"
                          onClick={() => toast.success("Report downloaded")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredCompetitors.map((competitor) => (
              <div key={competitor.Id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {competitor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-lg font-medium text-gray-900">
                        {competitor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {competitor.domain}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusColor(competitor.status)}
                    size="sm"
                  >
                    {competitor.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Est. Monthly Spend
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(competitor.estimatedSpend)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {competitor.spendTrend > 0 ? "+" : ""}{competitor.spendTrend}% vs last month
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Market Share
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {competitor.marketShare}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${competitor.marketShare}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {competitor.platforms.slice(0, 3).map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        size="sm"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getSeverityColor(competitor.threatLevel)}
                      size="sm"
                    >
                      {competitor.threatLevel} threat
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Eye"
                      onClick={() => toast.info("View details")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Creative Modal */}
      {selectedCreative && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Creative Example
              </h3>
              <Button
                size="sm"
                variant="ghost"
                icon="X"
                onClick={() => setSelectedCreative(null)}
              />
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <ApperIcon name="Image" className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Creative preview placeholder</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Ad Copy:</p>
                <p className="text-sm text-gray-600">{selectedCreative.adCopy}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Platform:</span>
                  <span className="ml-2 font-medium">{selectedCreative.platform}</span>
                </div>
                <div>
                  <span className="text-gray-500">Format:</span>
                  <span className="ml-2 font-medium">{selectedCreative.format}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorIntel;