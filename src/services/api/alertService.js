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
    
    const newId = Math.max(...alertData.map(a => a.Id)) + 1;
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

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = alertData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    
    const deletedAlert = alertData.splice(index, 1)[0];
    return { ...deletedAlert };
  }
};

export default alertService;