import contentData from "@/services/mockData/content.json";

const contentService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Return a copy of the data to prevent mutations
    return contentData.map(content => ({ ...content }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const content = contentData.find(item => item.Id === parseInt(id));
    if (!content) {
      throw new Error("Content not found");
    }
    
    return { ...content };
  },

  async create(newContent) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...contentData.map(c => c.Id)) + 1;
    const content = {
      Id: newId,
      ...newContent,
      createdAt: new Date().toISOString()
    };
    
    contentData.push(content);
    return { ...content };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = contentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Content not found");
    }
    
    const updatedContent = { 
      ...contentData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    contentData[index] = updatedContent;
    
    return { ...updatedContent };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contentData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Content not found");
    }
    
    const deletedContent = contentData.splice(index, 1)[0];
    return { ...deletedContent };
  },

  async generateContent(params) {
    // Simulate AI content generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockContent = this.generateMockContent(params.type, params.tone, params.brief);
    
    return {
      Id: Date.now(),
      brief: params.brief,
      type: params.type,
      tone: params.tone,
      generatedContent: mockContent,
      selectedVersion: 0,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
  },

  generateMockContent(type, tone, brief) {
    const contentTemplates = {
      ad_copy: {
        professional: [
          { content: `Discover the power of ${brief.includes("product") ? "our premium solution" : "advanced technology"}. Transform your business with proven results and expert support. Get started today with a free consultation.` },
          { content: `Experience excellence with our industry-leading ${brief.includes("service") ? "services" : "products"}. Join thousands of satisfied customers who trust us for reliable, professional solutions.` },
          { content: `Elevate your business performance with our comprehensive ${brief.includes("platform") ? "platform" : "solution"}. Designed for professionals who demand quality and results.` }
        ],
        casual: [
          { content: `Hey there! 👋 Ready to make your life easier? Our amazing ${brief.includes("app") ? "app" : "tool"} is here to help. Join the fun and see what everyone's talking about!` },
          { content: `Life's too short for complicated solutions. That's why we made ${brief.includes("simple") ? "something super simple" : "the easiest way"} to get things done. Try it now!` },
          { content: `Looking for something awesome? You found it! 🚀 Our ${brief.includes("product") ? "product" : "service"} makes everything better. Come see for yourself!` }
        ]
      },
      social_post: {
        professional: [
          { content: `Exciting news! We're proud to announce our latest innovation in ${brief.includes("AI") ? "artificial intelligence" : "business solutions"}. This development represents months of research and development, designed to deliver exceptional value to our clients. #Innovation #BusinessGrowth #Excellence` },
          { content: `Industry insight: The landscape of ${brief.includes("marketing") ? "digital marketing" : "business technology"} continues to evolve rapidly. Our team is committed to staying ahead of these trends to better serve our clients. What trends are you watching? #IndustryInsights #ThoughtLeadership` }
        ],
        casual: [
          { content: `OMG, you guys! 😍 We just launched something AMAZING and we can't contain our excitement! This new ${brief.includes("feature") ? "feature" : "update"} is going to change everything. Who's ready to try it? 🙋‍♀️ #Excited #NewLaunch #CommunityLove` },
          { content: `Friday vibes are hitting different when you love what you do! 💪 Our team has been working on something special and we can't wait to share it with you all. Stay tuned... 👀 #FridayFeels #TeamWork #ComingSoon` }
        ]
      }
    };
    
    const templates = contentTemplates[type]?.[tone] || contentTemplates.ad_copy.professional;
    return templates.slice(0, 3); // Return 3 variations
  }
};

export default contentService;