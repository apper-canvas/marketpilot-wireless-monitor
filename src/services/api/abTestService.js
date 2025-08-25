import abTestData from "@/services/mockData/abTests.json";

const abTestService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return abTestData.map(test => ({ ...test }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const test = abTestData.find(item => item.Id === parseInt(id));
    if (!test) {
      throw new Error("A/B test not found");
    }
    return { ...test };
  },

  async create(testData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...abTestData.map(t => t.Id)) + 1;
    const newTest = {
      Id: newId,
      ...testData,
      status: 'draft',
      variants: [
        {
          id: 'control',
          name: 'Control',
          description: 'Original version',
          trafficSplit: 50,
          visitors: 0,
          conversions: 0,
          revenue: 0
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    abTestData.push(newTest);
    return { ...newTest };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = abTestData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("A/B test not found");
    }
    
    const updatedTest = { 
      ...abTestData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    abTestData[index] = updatedTest;
    
    return { ...updatedTest };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = abTestData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("A/B test not found");
    }
    
    const deletedTest = abTestData.splice(index, 1)[0];
    return { ...deletedTest };
  },

  async addVariant(testId, variantData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const test = abTestData.find(item => item.Id === parseInt(testId));
    if (!test) {
      throw new Error("A/B test not found");
    }
    
    const newVariant = {
      id: `variant_${test.variants.length}`,
      ...variantData,
      visitors: 0,
      conversions: 0,
      revenue: 0
    };
    
    test.variants.push(newVariant);
    test.updatedAt = new Date().toISOString();
    
    return { ...test };
  }
};

export default abTestService;