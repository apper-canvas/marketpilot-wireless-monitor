// Mock data for campaigns since no database tables provided
const mockCampaigns = [
  {
    "Id": 1,
    "name": "Q4 Holiday Campaign",
    "status": "active",
    "accountId": "google-ads",
    "budget": 25000,
    "spend": 18750,
    "startDate": "2024-11-01",
    "endDate": "2024-12-31",
    "metrics": {
      "clicks": 12450,
      "impressions": 245000,
      "ctr": 5.08,
      "conversions": 234,
      "cpa": 80.13
    },
    "createdAt": "2024-10-28T10:00:00Z"
  },
  {
    "Id": 2,
    "name": "LinkedIn Lead Generation",
    "status": "active",
    "accountId": "linkedin",
    "budget": 15000,
    "spend": 8200,
    "startDate": "2024-01-15",
    "endDate": "2024-12-31",
    "metrics": {
      "clicks": 3420,
      "impressions": 85000,
      "ctr": 4.02,
      "conversions": 89,
      "cpa": 92.13
    },
    "createdAt": "2024-01-10T14:30:00Z"
  },
  {
    "Id": 3,
    "name": "Facebook Brand Awareness",
    "status": "paused",
    "accountId": "facebook",
    "budget": 20000,
    "spend": 12300,
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "metrics": {
      "clicks": 8900,
      "impressions": 190000,
      "ctr": 4.68,
      "conversions": 156,
      "cpa": 78.85
    },
    "createdAt": "2023-12-20T09:15:00Z"
  }
];

const campaignService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return a copy of the data to prevent mutations
    return mockCampaigns.map(campaign => ({ ...campaign }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const campaign = mockCampaigns.find(item => item.Id === parseInt(id));
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    
    return { ...campaign };
  },

  async create(newCampaign) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...mockCampaigns.map(c => c.Id)) + 1;
    const campaign = {
      Id: newId,
      ...newCampaign,
      createdAt: new Date().toISOString()
    };
    
    mockCampaigns.push(campaign);
    return { ...campaign };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = mockCampaigns.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    
    const updatedCampaign = { 
      ...mockCampaigns[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    mockCampaigns[index] = updatedCampaign;
    
    return { ...updatedCampaign };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockCampaigns.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }
    
    const deletedCampaign = mockCampaigns.splice(index, 1)[0];
    return { ...deletedCampaign };
  }
};

export default campaignService;