import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import reportService from "@/services/api/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    template: "",
    dateRange: { start: "", end: "" },
    metrics: [],
    schedule: "",
    recipients: []
  });

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reportService.getAll();
      setReports(data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const reportTemplates = [
    { value: "campaign_performance", label: "Campaign Performance", icon: "BarChart3" },
    { value: "roi_analysis", label: "ROI Analysis", icon: "TrendingUp" },
    { value: "audience_insights", label: "Audience Insights", icon: "Users" },
    { value: "competitive_analysis", label: "Competitive Analysis", icon: "Target" },
    { value: "monthly_summary", label: "Monthly Summary", icon: "Calendar" },
    { value: "executive_dashboard", label: "Executive Dashboard", icon: "PieChart" }
  ];

  const scheduleOptions = [
    { value: "manual", label: "Manual" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  const getTemplateIcon = (template) => {
    const found = reportTemplates.find(t => t.value === template);
    return found ? found.icon : "FileText";
  };

  const getTemplateLabel = (template) => {
    const found = reportTemplates.find(t => t.value === template);
    return found ? found.label : template;
  };

  const getScheduleBadgeColor = (schedule) => {
    switch (schedule) {
      case "daily": return "success";
      case "weekly": return "info";
      case "monthly": return "accent";
      default: return "default";
    }
  };

  const handleCreateReport = async () => {
    if (!newReport.name || !newReport.template) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const createdReport = await reportService.create(newReport);
      setReports([createdReport, ...reports]);
      setShowCreateModal(false);
      setNewReport({
        name: "",
        template: "",
        dateRange: { start: "", end: "" },
        metrics: [],
        schedule: "",
        recipients: []
      });
      toast.success("Report created successfully");
    } catch (err) {
      toast.error("Failed to create report");
    }
  };

  const handleGenerateReport = async (reportId) => {
    try {
      toast.info("Generating report...");
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Report generated successfully");
    } catch (err) {
      toast.error("Failed to generate report");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await reportService.delete(reportId);
      setReports(reports.filter(report => report.Id !== reportId));
      toast.success("Report deleted successfully");
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReports} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Create, schedule, and manage custom reports for your marketing performance
          </p>
        </div>
        
        <Button
          icon="Plus"
          size="lg"
          onClick={() => setShowCreateModal(true)}
        >
          Create Report
        </Button>
      </div>

      {/* Report Templates */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Quick Report Templates
          </h3>
          <Button variant="outline" size="sm" icon="Shuffle">
            View All Templates
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.value}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => {
                setNewReport({ ...newReport, template: template.value });
                setShowCreateModal(true);
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center group-hover:from-primary-200 group-hover:to-secondary-200 transition-colors duration-200">
                  <ApperIcon name={template.icon} className="w-5 h-5 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900">{template.label}</h4>
              </div>
              <p className="text-sm text-gray-600">
                Generate comprehensive {template.label.toLowerCase()} with key metrics and insights.
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reports List */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            My Reports ({filteredReports.length})
          </h3>
          
          <div className="flex items-center space-x-3">
            <SearchBar
              placeholder="Search reports..."
              onSearch={setSearchQuery}
              className="w-64"
            />
            <Button variant="outline" icon="RefreshCw" size="sm" onClick={loadReports}>
              Refresh
            </Button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <Empty 
            variant="reports"
            action={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.Id} className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name={getTemplateIcon(report.template)} className="w-5 h-5 text-gray-600" />
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {report.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" size="sm">
                            {getTemplateLabel(report.template)}
                          </Badge>
                          {report.schedule && report.schedule !== "manual" && (
                            <Badge variant={getScheduleBadgeColor(report.schedule)} size="sm">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" className="w-3 h-3" />
                                <span className="capitalize">{report.schedule}</span>
                              </div>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Metrics:</span>
                        <div className="text-gray-900">{report.metrics?.length || 0} selected</div>
                      </div>
                      <div>
<div className="text-gray-900">
                          {report.dateRange?.start && !isNaN(new Date(report.dateRange.start).getTime()) && 
                           report.dateRange?.end && !isNaN(new Date(report.dateRange.end).getTime()) ? 
                            `${format(new Date(report.dateRange.start), "MMM dd")} - ${format(new Date(report.dateRange.end), "MMM dd")}` :
                            "Last 30 days"
                          }
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Recipients:</span>
                        <div className="text-gray-900">{report.recipients?.length || 0} users</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Generated:</span>
                        <div className="text-gray-900">
                          {format(new Date(), "MMM dd, HH:mm")}
                        </div>
                      </div>
</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      icon="FileText"
                      onClick={() => handleGenerateReport(report.Id)}
                    >
                      Generate
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      icon="Download"
                    >
                      Download
                    </Button>
                    
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
        )}
      </Card>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Create New Report
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Report Name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="Monthly Performance Report"
                  required
                />
                
                <Select
                  label="Report Template"
                  value={newReport.template}
                  onChange={(e) => setNewReport({ ...newReport, template: e.target.value })}
                  required
                >
                  {reportTemplates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={newReport.dateRange.start}
                  onChange={(e) => setNewReport({ 
                    ...newReport, 
                    dateRange: { ...newReport.dateRange, start: e.target.value }
                  })}
                />
                
                <Input
                  type="date"
                  label="End Date"
                  value={newReport.dateRange.end}
                  onChange={(e) => setNewReport({ 
                    ...newReport, 
                    dateRange: { ...newReport.dateRange, end: e.target.value }
                  })}
                />
              </div>
              
              <Select
                label="Schedule"
                value={newReport.schedule}
                onChange={(e) => setNewReport({ ...newReport, schedule: e.target.value })}
              >
                {scheduleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              
              <Input
                label="Recipients (Email addresses)"
                value={newReport.recipients.join(", ")}
                onChange={(e) => setNewReport({ 
                  ...newReport, 
                  recipients: e.target.value.split(",").map(email => email.trim()).filter(Boolean)
                })}
                placeholder="user@company.com, manager@company.com"
                helper="Separate multiple email addresses with commas"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateReport}
              >
                Create Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;