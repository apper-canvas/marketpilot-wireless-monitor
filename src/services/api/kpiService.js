// Mock data for KPIs since no database tables provided
const mockKPIs = [
  {
    "Id": 1,
    "name": "Total Revenue",
    "value": 125000,
    "changePercent": 12.5,
    "trend": "up",
    "icon": "DollarSign",
    "type": "currency"
  },
  {
    "Id": 2,
    "name": "Total Clicks", 
    "value": 45234,
    "changePercent": -3.2,
    "trend": "down",
    "icon": "MousePointer",
    "type": "number"
  },
  {
    "Id": 3,
    "name": "Conversion Rate",
    "value": 3.4,
    "changePercent": 8.1,
    "trend": "up", 
    "icon": "Target",
    "type": "percentage"
  },
  {
    "Id": 4,
    "name": "Cost Per Click",
    "value": 2.85,
    "changePercent": -15.3,
    "trend": "down",
    "icon": "TrendingDown",
    "type": "currency"
  },
  {
    "Id": 5,
    "name": "ROAS",
    "value": 4.2,
    "changePercent": 18.7,
    "trend": "up",
    "icon": "TrendingUp", 
    "type": "number"
  }
];

const kpiService = {
  async getKPIs(accountId = "", dateRange = "30d") {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy of the data to prevent mutations
    let filteredKPIs = [...mockKPIs];
    
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
    
    const kpi = mockKPIs.find(item => item.Id === parseInt(id));
    if (!kpi) {
      throw new Error("KPI not found");
    }
    
    return { ...kpi };
  },

  async updateKPI(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockKPIs.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("KPI not found");
    }
    
    const updatedKPI = { ...mockKPIs[index], ...updates };
    mockKPIs[index] = updatedKPI;
    
    return { ...updatedKPI };
  }
};

export default kpiService;