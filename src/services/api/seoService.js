import seoData from "@/services/mockData/seo.json";

const seoService = {
  async getKeywordClusters() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return seoData.keywordClusters.map(cluster => ({
      ...cluster
    }));
  },

  async getContentSuggestions() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return seoData.contentSuggestions.map(suggestion => ({
      ...suggestion
    }));
  },

  async generateContentIdeas(clusterId) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate AI-generated content ideas
    const cluster = seoData.keywordClusters.find(c => c.Id === clusterId);
    if (!cluster) throw new Error("Cluster not found");

    const newIdeas = [
      {
        Id: Date.now() + Math.random(),
        title: `Complete Guide to ${cluster.name}`,
        description: `Comprehensive resource covering all aspects of ${cluster.name} with actionable insights.`,
        contentType: "Guide",
        priority: "High",
        estimatedTraffic: "5K-10K",
        clusterId: clusterId
      },
      {
        Id: Date.now() + Math.random() + 1,
        title: `${cluster.name}: Best Practices and Tips`,
        description: `Expert tips and proven strategies for maximizing results with ${cluster.name}.`,
        contentType: "Blog Post",
        priority: "Medium", 
        estimatedTraffic: "2K-5K",
        clusterId: clusterId
      }
    ];

    return newIdeas;
  },

  async exportClusterData(clusterId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const cluster = seoData.keywordClusters.find(c => c.Id === clusterId);
    if (!cluster) throw new Error("Cluster not found");

    // Simulate CSV export
    const csvData = [
      ["Keyword", "Search Volume", "Difficulty", "CPC"],
      ...cluster.keywords.map(k => [k.term, k.volume, k.difficulty, k.cpc || "N/A"])
    ];
    
    return csvData;
  },

  async exportAllData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate full export
    return {
      clusters: seoData.keywordClusters,
      suggestions: seoData.contentSuggestions,
      exportDate: new Date().toISOString()
    };
  },

  async getClusterById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const cluster = seoData.keywordClusters.find(item => item.Id === parseInt(id));
    if (!cluster) {
      throw new Error("Cluster not found");
    }
    
    return { ...cluster };
  },

  async updateCluster(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = seoData.keywordClusters.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Cluster not found");
    }
    
    const updatedCluster = { ...seoData.keywordClusters[index], ...updates };
    seoData.keywordClusters[index] = updatedCluster;
    
    return { ...updatedCluster };
  }
};

export default seoService;