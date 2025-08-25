import reportData from "@/services/mockData/reports.json";

const reportService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return a copy of the data to prevent mutations
    return reportData.map(report => ({ ...report }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const report = reportData.find(item => item.Id === parseInt(id));
    if (!report) {
      throw new Error("Report not found");
    }
    
    return { ...report };
  },

  async create(newReport) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...reportData.map(r => r.Id)) + 1;
    const report = {
      Id: newId,
      ...newReport,
      createdAt: new Date().toISOString(),
      lastGenerated: null
    };
    
    reportData.push(report);
    return { ...report };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = reportData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Report not found");
    }
    
    const updatedReport = { 
      ...reportData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    reportData[index] = updatedReport;
    
    return { ...updatedReport };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = reportData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Report not found");
    }
    
    const deletedReport = reportData.splice(index, 1)[0];
    return { ...deletedReport };
  },

  async generate(id) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const report = await this.getById(id);
    const updatedReport = await this.update(id, {
      lastGenerated: new Date().toISOString(),
      status: "completed"
    });
    
    return updatedReport;
  }
};

export default reportService;