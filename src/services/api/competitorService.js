// Import mock data
import competitorData from "@/services/mockData/competitors.json";

const competitorService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a copy of the data to prevent mutations
    return competitorData.map(competitor => ({ ...competitor }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const competitor = competitorData.find(item => item.Id === parseInt(id));
    if (!competitor) {
      throw new Error("Competitor not found");
    }
    
    return { ...competitor };
  },

  async create(newCompetitor) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...competitorData.map(c => c.Id)) + 1;
    const competitor = {
      Id: newId,
      ...newCompetitor,
      createdAt: new Date().toISOString(),
      status: "monitoring",
      alertsEnabled: false
    };
    
    competitorData.push(competitor);
    return { ...competitor };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = competitorData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Competitor not found");
    }
    
    const updatedCompetitor = { 
      ...competitorData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    competitorData[index] = updatedCompetitor;
    
    return { ...updatedCompetitor };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = competitorData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Competitor not found");
    }
    
    const deletedCompetitor = competitorData.splice(index, 1)[0];
    return { ...deletedCompetitor };
  }
};

export default competitorService;