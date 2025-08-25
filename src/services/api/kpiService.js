import kpiData from "@/services/mockData/kpis.json";

const kpiService = {
  async getKPIs(accountId = "", dateRange = "30d") {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy of the data to prevent mutations
    let filteredKPIs = [...kpiData];
    
    // Apply filters if needed
    if (accountId) {
      filteredKPIs = filteredKPIs.filter(kpi => 
        kpi.accountId === accountId || !kpi.accountId
      );
    }
    
    return filteredKPIs.map(kpi => ({
      ...kpi,
      // Simulate data variation based on date range
      value: dateRange === "7d" ? kpi.value * 0.7 : 
             dateRange === "90d" ? kpi.value * 1.5 : kpi.value
    }));
  },

  async getKPIById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const kpi = kpiData.find(item => item.Id === parseInt(id));
    if (!kpi) {
      throw new Error("KPI not found");
    }
    
    return { ...kpi };
  },

  async updateKPI(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = kpiData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("KPI not found");
    }
    
    const updatedKPI = { ...kpiData[index], ...updates };
    kpiData[index] = updatedKPI;
    
    return { ...updatedKPI };
  }
};

export default kpiService;