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
import creativeService from "@/services/api/creativeService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const CreativeStudio = () => {
  const [creativeContent, setCreativeContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator state
  const [brief, setBrief] = useState("");
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [imageStyle, setImageStyle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const loadCreativeContent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await creativeService.getAll();
      setCreativeContent(data);
    } catch (err) {
      setError("Failed to load creative content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreativeContent();
  }, []);

  const contentTypes = [
    { value: "ad_copy", label: "Ad Copy" },
    { value: "social_post", label: "Social Media Post" },
    { value: "email", label: "Email Campaign" },
    { value: "landing_copy", label: "Landing Page Copy" },
    { value: "banner_ad", label: "Banner Advertisement" }
  ];

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "google_ads", label: "Google Ads" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter/X" },
    { value: "tiktok", label: "TikTok" },
    { value: "email", label: "Email Marketing" },
    { value: "web", label: "Website" }
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual & Friendly" },
    { value: "urgent", label: "Urgent & Direct" },
    { value: "inspirational", label: "Inspirational" },
    { value: "humorous", label: "Light & Humorous" },
    { value: "luxury", label: "Premium & Luxury" }
  ];

  const imageStyles = [
    { value: "photorealistic", label: "Photorealistic" },
    { value: "illustration", label: "Digital Illustration" },
    { value: "minimalist", label: "Minimalist Design" },
    { value: "abstract", label: "Abstract Art" },
    { value: "vintage", label: "Vintage Style" },
    { value: "modern", label: "Modern & Clean" }
  ];

  const handleGenerate = async () => {
    if (!brief || !contentType || !platform || !tone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setGenerating(true);
      const result = await creativeService.generateCreative({
        brief,
        type: contentType,
        platform,
        tone,
        imageStyle: imageStyle || "photorealistic"
      });
      setGeneratedContent(result);
      toast.success("Creative content generated successfully!");
    } catch (err) {
      toast.error("Failed to generate creative content");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    try {
      const savedContent = await creativeService.create({
        brief,
        type: contentType,
        platform,
        tone,
        imageStyle,
        content: generatedContent.content,
        imageUrls: generatedContent.imageUrls,
        complianceStatus: generatedContent.complianceStatus,
        complianceIssues: generatedContent.complianceIssues,
        status: "draft"
      });
      
      setCreativeContent([savedContent, ...creativeContent]);
      toast.success("Creative content saved as draft");
      
      // Reset form
      setBrief("");
      setContentType("");
      setPlatform("");
      setTone("");
      setImageStyle("");
      setGeneratedContent(null);
      setShowGenerator(false);
    } catch (err) {
      toast.error("Failed to save creative content");
    }
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      const updatedContent = await creativeService.update(contentId, { status: newStatus });
      setCreativeContent(creativeContent.map(content => 
        content.Id === contentId ? updatedContent : content
      ));
      toast.success(`Content ${newStatus} successfully`);
    } catch (err) {
      toast.error(`Failed to update content status`);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this creative content?")) return;
    
    try {
      await creativeService.delete(contentId);
      setCreativeContent(creativeContent.filter(content => content.Id !== contentId));
      toast.success("Creative content deleted successfully");
    } catch (err) {
      toast.error("Failed to delete content");
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "warning": return "warning";
      case "rejected": return "error";
      case "pending": return "info";
      default: return "default";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "facebook": return "Facebook";
      case "instagram": return "Instagram";
      case "google_ads": return "Search";
      case "linkedin": return "Linkedin";
      case "twitter": return "Twitter";
      case "tiktok": return "Music";
      case "email": return "Mail";
      case "web": return "Globe";
      default: return "Share2";
    }
  };

  const filteredContent = creativeContent.filter(content => {
    const matchesSearch = content.brief.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || content.type === typeFilter;
    const matchesPlatform = !platformFilter || content.platform === platformFilter;
    const matchesCompliance = !complianceFilter || content.complianceStatus === complianceFilter;
    return matchesSearch && matchesType && matchesPlatform && matchesCompliance;
  });

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCreativeContent} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Creative Studio
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered creative suggestions with image generation and compliance checking
          </p>
        </div>
        <Button 
          icon="Plus" 
          onClick={() => setShowGenerator(!showGenerator)}
          className="shrink-0"
        >
          Create New Content
        </Button>
      </div>

      {/* Creative Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Palette" className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {creativeContent.length}
          </div>
          <div className="text-sm text-gray-600">Total Creatives</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle2" className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {creativeContent.filter(c => c.complianceStatus === "approved").length}
          </div>
          <div className="text-sm text-gray-600">Compliant</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {creativeContent.filter(c => c.complianceStatus === "warning").length}
          </div>
          <div className="text-sm text-gray-600">Need Review</div>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Image" className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {creativeContent.reduce((acc, c) => acc + (c.imageUrls?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Generated Images</div>
        </Card>
      </div>

      {/* AI Creative Generator */}
      {showGenerator && (
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  AI Creative Generator
                </h3>
                <p className="text-sm text-gray-600">
                  Generate creative content with images and compliance checking
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              icon="X"
              onClick={() => setShowGenerator(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Content Type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              required
            >
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>

            <Select
              label="Platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
            >
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>

            <Select
              label="Tone of Voice"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              required
            >
              {tones.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>

            <Select
              label="Image Style"
              value={imageStyle}
              onChange={(e) => setImageStyle(e.target.value)}
              helper="Optional - AI will suggest appropriate images"
            >
              <option value="">Auto-select style</option>
              {imageStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Creative Brief"
            placeholder="Describe your creative needs, target audience, key messages, and any specific requirements..."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            helper="Be specific about your goals, audience, and desired outcome for better results"
            required
          />

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleGenerate}
              loading={generating}
              disabled={!brief || !contentType || !platform || !tone}
              icon="Sparkles"
            >
              Generate Creative Content
            </Button>
          </div>

          {/* Generated Content Preview */}
          {generatedContent && (
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Generated Creative</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={getComplianceColor(generatedContent.complianceStatus)}>
                    {generatedContent.complianceStatus}
                  </Badge>
                  {generatedContent.imageUrls && (
                    <Badge variant="info">
                      {generatedContent.imageUrls.length} Images
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ApperIcon name={getPlatformIcon(platform)} className="w-4 h-4 text-gray-600" />
                  <Badge variant="outline" size="sm">
                    {platforms.find(p => p.value === platform)?.label}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {contentTypes.find(t => t.value === contentType)?.label}
                  </Badge>
                </div>
                
                <div className="prose prose-sm max-w-none mb-6">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {generatedContent.content}
                  </div>
                </div>

                {/* Image Suggestions */}
                {generatedContent.imageUrls && generatedContent.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                      <ApperIcon name="Image" className="w-4 h-4" />
                      <span>AI Generated Images</span>
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {generatedContent.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center p-4">
                              <ApperIcon name="Image" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Generated Image {index + 1}</p>
                              <p className="text-xs text-gray-400 mt-1">{generatedContent.imageDescriptions?.[index] || "AI-generated visual"}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            icon="Download"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Check */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 flex items-center space-x-2 mb-3">
                    <ApperIcon name="Shield" className="w-4 h-4" />
                    <span>Compliance Check</span>
                  </h5>
                  
                  {generatedContent.complianceIssues && generatedContent.complianceIssues.length > 0 ? (
                    <div className="space-y-2">
                      {generatedContent.complianceIssues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                          <ApperIcon name="AlertTriangle" className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">{issue.type}</p>
                            <p className="text-sm text-yellow-700">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-sm text-yellow-600 mt-1">
                                <strong>Suggestion:</strong> {issue.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <ApperIcon name="CheckCircle2" className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-800">Content meets compliance guidelines for {platforms.find(p => p.value === platform)?.label}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button onClick={handleSave} icon="Save">
                  Save Creative
                </Button>
                <Button variant="outline" icon="Copy">
                  Copy Content
                </Button>
                <Button variant="outline" icon="Download">
                  Export Package
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Creative Content Management */}
      <Card>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search creative content by brief or keywords..."
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
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>
            
            <Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="min-w-[130px]"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </Select>
            
            <Select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="min-w-[130px]"
            >
              <option value="">All Compliance</option>
              <option value="approved">Approved</option>
              <option value="warning">Needs Review</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
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
            title="No creative content found"
            description="Create your first AI-powered creative content with images and compliance checking."
            action={() => setShowGenerator(true)}
            actionText="Generate Content"
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Creative Content ({filteredContent.length})
              </h3>
              
              <Button size="sm" variant="outline" icon="RefreshCw" onClick={loadCreativeContent}>
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
                          <ApperIcon name={getPlatformIcon(content.platform)} className="w-4 h-4 text-gray-600" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" size="sm">
                            {contentTypes.find(t => t.value === content.type)?.label}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {platforms.find(p => p.value === content.platform)?.label}
                          </Badge>
                          <Badge variant={getComplianceColor(content.complianceStatus)} size="sm">
                            {content.complianceStatus}
                          </Badge>
                          {content.imageUrls && content.imageUrls.length > 0 && (
                            <Badge variant="info" size="sm">
                              {content.imageUrls.length} Images
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-md font-semibold text-gray-900 mb-2 line-clamp-2">
                        {content.brief}
                      </h4>
                      
                      {content.content && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="text-sm text-gray-800 line-clamp-3">
                            {content.content}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span>Created: {format(new Date(content.createdAt), "MMM dd, yyyy HH:mm")}</span>
                        <span>Tone: {content.tone}</span>
                        {content.complianceIssues && content.complianceIssues.length > 0 && (
                          <span className="text-yellow-600">
                            {content.complianceIssues.length} issues
                          </span>
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

export default CreativeStudio;