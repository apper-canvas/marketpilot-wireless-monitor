import campaignData from "@/services/mockData/campaigns.json";

const campaignService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return a copy of the data to prevent mutations
    return campaignData.map(campaign => ({ ...campaign }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const campaign = campaignData.find(item => item.Id === parseInt(id));
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    
    return { ...campaign };
  },

  async create(campaignData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...campaignData.map(c => c.Id)) + 1;
    const newCampaign = {
      Id: newId,
      ...campaignData,
      createdAt: new Date().toISOString()
    };
    
    campaignData.push(newCampaign);
    return { ...newCampaign };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = campaignData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    
    const updatedCampaign = { 
      ...campaignData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    campaignData[index] = updatedCampaign;
    
    return { ...updatedCampaign };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = campaignData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    
    const deletedCampaign = campaignData.splice(index, 1)[0];
    return { ...deletedCampaign };
  }
};

export default campaignService;