import accountData from "@/services/mockData/accounts.json";

const accountService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Return a copy of the data to prevent mutations
    return accountData.map(account => ({ ...account }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const account = accountData.find(item => item.Id === parseInt(id));
    if (!account) {
      throw new Error("Account not found");
    }
    
    return { ...account };
  },

  async create(newAccount) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...accountData.map(a => a.Id)) + 1;
    const account = {
      Id: newId,
      ...newAccount,
      createdAt: new Date().toISOString()
    };
    
    accountData.push(account);
    return { ...account };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = accountData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Account not found");
    }
    
    const updatedAccount = { 
      ...accountData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    accountData[index] = updatedAccount;
    
    return { ...updatedAccount };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = accountData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Account not found");
    }
    
    const deletedAccount = accountData.splice(index, 1)[0];
    return { ...deletedAccount };
  },

  async syncAccount(id) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return await this.update(id, {
      lastSync: new Date().toISOString(),
      status: "connected"
    });
  }
};

export default accountService;