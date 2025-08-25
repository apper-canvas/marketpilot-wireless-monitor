import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import seoService from "@/services/api/seoService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Content from "@/components/pages/Content";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const SEOPanel = () => {
  const [keywordClusters, setKeywordClusters] = useState([]);
  const [contentSuggestions, setContentSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [volumeFilter, setVolumeFilter] = useState("all");
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [clusters, suggestions] = await Promise.all([
        seoService.getKeywordClusters(),
        seoService.getContentSuggestions()
      ]);
      setKeywordClusters(clusters);
      setContentSuggestions(suggestions);
    } catch (err) {
      setError("Failed to load SEO data");
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateContent = async (clusterId) => {
    try {
      setGeneratingContent(true);
      const newSuggestions = await seoService.generateContentIdeas(clusterId);
      setContentSuggestions(prev => [...newSuggestions, ...prev]);
      toast.success("New content ideas generated!");
    } catch (err) {
      toast.error("Failed to generate content ideas");
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleExportCluster = async (cluster) => {
    try {
      await seoService.exportClusterData(cluster.Id);
      toast.success(`Exported ${cluster.name} cluster data`);
    } catch (err) {
      toast.error("Failed to export cluster data");
    }
  };

  const filteredClusters = keywordClusters.filter(cluster => {
    const matchesSearch = cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cluster.keywords.some(k => k.term.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "all" || 
                             (difficultyFilter === "easy" && cluster.avgDifficulty <= 30) ||
                             (difficultyFilter === "medium" && cluster.avgDifficulty > 30 && cluster.avgDifficulty <= 70) ||
                             (difficultyFilter === "hard" && cluster.avgDifficulty > 70);
    
    const matchesVolume = volumeFilter === "all" ||
                         (volumeFilter === "high" && cluster.totalVolume >= 10000) ||
                         (volumeFilter === "medium" && cluster.totalVolume >= 1000 && cluster.totalVolume < 10000) ||
                         (volumeFilter === "low" && cluster.totalVolume < 1000);

    return matchesSearch && matchesDifficulty && matchesVolume;
  });

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return "success";
    if (difficulty <= 70) return "warning";
    return "error";
  };

  const getDifficultyText = (difficulty) => {
    if (difficulty <= 30) return "Easy";
    if (difficulty <= 70) return "Medium";
    return "Hard";
  };

  const getVolumeColor = (volume) => {
    if (volume >= 10000) return "success";
    if (volume >= 1000) return "info";
    return "default";
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            SEO Keyword Panel
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze keyword clusters and discover content opportunities
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={() => seoService.exportAllData().then(() => toast.success("SEO data exported!"))}
          >
            Export All
          </Button>
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={loadData}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search keywords or clusters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (≤30)</option>
            <option value="medium">Medium (31-70)</option>
            <option value="hard">Hard (>70)</option>
          </Select>
          
          <Select
            value={volumeFilter}
            onChange={(e) => setVolumeFilter(e.target.value)}
          >
<option value="all">All Volumes</option>
            <option value="high">High (≥10K)</option>
            <option value="medium">Medium (1K-10K)</option>
            <option value="low">Low (&lt;1K)</option>
          </Select>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Keyword Clusters */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Keyword Clusters ({filteredClusters.length})
              </h2>
              <Badge variant="info" size="sm">
                {keywordClusters.reduce((sum, cluster) => sum + cluster.totalVolume, 0).toLocaleString()} total volume
              </Badge>
            </div>

            <div className="space-y-4">
              {filteredClusters.map((cluster) => (
                <div
                  key={cluster.Id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCluster?.Id === cluster.Id
                      ? "border-primary-300 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {cluster.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge 
                          variant={getDifficultyColor(cluster.avgDifficulty)}
                          size="sm"
                        >
                          {getDifficultyText(cluster.avgDifficulty)} Difficulty
                        </Badge>
                        <Badge 
                          variant={getVolumeColor(cluster.totalVolume)}
                          size="sm"
                        >
                          {cluster.totalVolume.toLocaleString()} volume
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {cluster.keywords.length} keywords
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Lightbulb"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateContent(cluster.Id);
                        }}
                        loading={generatingContent}
                      >
                        Generate Ideas
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportCluster(cluster);
                        }}
                      />
                    </div>
                  </div>

                  {/* Keyword Preview */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cluster.keywords.slice(0, 5).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {keyword.term}
                      </span>
                    ))}
                    {cluster.keywords.length > 5 && (
                      <span className="inline-block px-2 py-1 text-xs text-gray-500">
                        +{cluster.keywords.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Content Opportunity</span>
                      <span>{cluster.opportunity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${cluster.opportunity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredClusters.length === 0 && (
                <div className="text-center py-12">
                  <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No clusters found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cluster Details */}
          {selectedCluster && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">
                Cluster Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Keywords ({selectedCluster.keywords.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCluster.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{keyword.term}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{keyword.volume.toLocaleString()}</span>
                          <Badge 
                            variant={getDifficultyColor(keyword.difficulty)}
                            size="sm"
                          >
                            {keyword.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">SEO Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Search Volume</span>
                      <span className="font-medium">{selectedCluster.totalVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Difficulty</span>
                      <span className="font-medium">{selectedCluster.avgDifficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Competition Level</span>
                      <span className="font-medium">{selectedCluster.competition}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Content Suggestions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">
                Content Ideas
              </h3>
              <Badge variant="primary" size="sm">
                {contentSuggestions.length} ideas
              </Badge>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contentSuggestions.map((suggestion) => (
                <div key={suggestion.Id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {suggestion.title}
                    </h4>
                    <Badge 
                      variant={suggestion.priority === "High" ? "error" : suggestion.priority === "Medium" ? "warning" : "success"}
                      size="sm"
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {suggestion.contentType} • {suggestion.estimatedTraffic} potential traffic
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="ExternalLink"
                      onClick={() => {
                        // Simulate opening content creator
                        toast.info("Opening content creator...");
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SEO Tips */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">
              SEO Best Practices
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <ApperIcon name="Target" className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Focus on Long-tail Keywords</p>
                  <p className="text-xs text-blue-700 mt-1">Target 3-5 word phrases with lower competition</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Content Clustering</p>
                  <p className="text-xs text-green-700 mt-1">Create comprehensive content around keyword themes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <ApperIcon name="Search" className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Search Intent</p>
                  <p className="text-xs text-yellow-700 mt-1">Match content type to user search intent</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEOPanel;