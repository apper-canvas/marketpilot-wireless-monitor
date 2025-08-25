import alertData from "@/services/mockData/alerts.json";

const alertService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy of the data to prevent mutations
    return alertData.map(alert => ({ ...alert }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const alert = alertData.find(item => item.Id === parseInt(id));
    if (!alert) {
      throw new Error("Alert not found");
    }
    
    return { ...alert };
  },

async create(newAlert) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...alertData.map(a => a.Id), 0) + 1;
    const alert = {
      Id: newId,
      ...newAlert,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    
    alertData.push(alert);
    return { ...alert };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = alertData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    
const updatedAlert = { 
      ...alertData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    alertData[index] = updatedAlert;
    
    return { ...updatedAlert };
  },

  async getCompetitorAlerts() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return alertData.filter(alert => alert.type?.includes('competitor')).map(alert => ({ ...alert }));
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = alertData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    
const deletedAlert = alertData.splice(index, 1)[0];
    return { ...deletedAlert };
  },

  async createCompetitorAlert(competitorId, alertType, data) {
    const alert = {
      type: `competitor_${alertType}`,
      severity: "info",
      metric: alertType,
      threshold: 0,
      currentValue: 1,
      competitorId: parseInt(competitorId),
      accountId: "system",
      ...data
    };
    return this.create(alert);
  }
};

export default alertService;