import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import AIContentGenerator from "@/components/organisms/AIContentGenerator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import contentService from "@/services/api/contentService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Content = () => {
  const [contentDrafts, setContentDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.getAll();
      setContentDrafts(data);
    } catch (err) {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "ad_copy": return "Megaphone";
      case "social_post": return "Share2";
      case "email": return "Mail";
      case "landing_page": return "Globe";
      case "blog_post": return "FileText";
      default: return "FileText";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "ad_copy": return "Ad Copy";
      case "social_post": return "Social Post";
      case "email": return "Email";
      case "landing_page": return "Landing Page";
      case "blog_post": return "Blog Post";
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "info";
      case "approved": return "success";
      case "published": return "accent";
      case "rejected": return "error";
      default: return "default";
    }
  };

  const getToneColor = (tone) => {
    switch (tone) {
      case "professional": return "bg-blue-100 text-blue-800";
      case "casual": return "bg-green-100 text-green-800";
      case "urgent": return "bg-red-100 text-red-800";
      case "inspirational": return "bg-purple-100 text-purple-800";
      case "humorous": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      const updatedContent = await contentService.update(contentId, { status: newStatus });
      setContentDrafts(contentDrafts.map(content => 
        content.Id === contentId ? updatedContent : content
      ));
      toast.success(`Content ${newStatus} successfully`);
    } catch (err) {
      toast.error(`Failed to update content status`);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    try {
      await contentService.delete(contentId);
      setContentDrafts(contentDrafts.filter(content => content.Id !== contentId));
      toast.success("Content deleted successfully");
    } catch (err) {
      toast.error("Failed to delete content");
    }
  };

  const filteredContent = contentDrafts.filter(content => {
    const matchesSearch = content.brief.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || content.type === typeFilter;
    const matchesStatus = !statusFilter || content.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContent} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Content Studio
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered content generation and management for all your marketing channels
          </p>
        </div>
      </div>

      {/* AI Content Generator */}
      <AIContentGenerator />

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="FileText" className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contentDrafts.filter(c => c.status === "draft").length}
          </div>
          <div className="text-sm text-gray-600">Draft Content</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contentDrafts.filter(c => c.status === "approved").length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Send" className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contentDrafts.filter(c => c.status === "published").length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Sparkles" className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {contentDrafts.length}
          </div>
          <div className="text-sm text-gray-600">Total Generated</div>
        </Card>
      </div>

      {/* Content Management */}
      <Card>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search content by brief or keywords..."
              onSearch={setSearchQuery}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="min-w-[140px]"
            >
              <option value="">All Types</option>
              <option value="ad_copy">Ad Copy</option>
              <option value="social_post">Social Post</option>
              <option value="email">Email</option>
              <option value="landing_page">Landing Page</option>
              <option value="blog_post">Blog Post</option>
            </Select>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </Select>
            
            <Button variant="outline" icon="Download" size="sm">
              Export
            </Button>
          </div>
        </div>

        {/* Content List */}
        {filteredContent.length === 0 ? (
          <Empty 
            variant="content"
            action={() => {}}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                All Content ({filteredContent.length})
              </h3>
              
              <Button size="sm" variant="outline" icon="RefreshCw" onClick={loadContent}>
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <div key={content.Id} className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name={getTypeIcon(content.type)} className="w-4 h-4 text-gray-600" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" size="sm">
                            {getTypeLabel(content.type)}
                          </Badge>
                          <Badge variant={getStatusColor(content.status)} size="sm">
                            {content.status}
                          </Badge>
                          <span className={`px-2 py-1 text-xs rounded-full ${getToneColor(content.tone)}`}>
                            {content.tone}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-md font-semibold text-gray-900 mb-2 line-clamp-1">
                        {content.brief}
                      </h4>
                      
                      {content.generatedContent && content.generatedContent[content.selectedVersion] && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="text-sm text-gray-800 line-clamp-3">
                            {content.generatedContent[content.selectedVersion].content}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span>Created: {format(new Date(content.createdAt), "MMM dd, yyyy HH:mm")}</span>
                        <span>
                          Versions: {content.generatedContent ? content.generatedContent.length : 0}
                        </span>
                        {content.selectedVersion !== undefined && (
                          <span>Selected: Version {content.selectedVersion + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {content.status === "draft" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            icon="CheckCircle"
                            onClick={() => handleStatusChange(content.Id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon="Edit"
                          >
                            Edit
                          </Button>
                        </>
                      )}
                      
                      {content.status === "approved" && (
                        <Button
                          size="sm"
                          variant="accent"
                          icon="Send"
                          onClick={() => handleStatusChange(content.Id, "published")}
                        >
                          Publish
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Copy"
                      >
                        Copy
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

export default Content;