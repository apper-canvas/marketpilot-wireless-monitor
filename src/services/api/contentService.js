import contentData from "@/services/mockData/content.json";
import React from "react";
import Error from "@/components/ui/Error";

// Helper function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate AI content variations
const generateContentVariations = (brief, type, tone) => {
  const variations = [];
  
  // Base content templates by type and tone
  const templates = {
    ad_copy: {
      professional: [
        "Elevate your {topic} with our proven solution. Trusted by industry leaders, our {service} delivers measurable results that drive growth and success.",
        "Transform your {topic} challenges into competitive advantages. Our expert-designed {service} empowers businesses to achieve exceptional outcomes.",
        "Don't let {topic} limitations hold you back. Our innovative {service} provides the tools and insights you need to excel in today's market."
      ],
      casual: [
        "Ready to level up your {topic}? We've got the perfect solution that'll make your life so much easier. Seriously, you'll wonder how you lived without it!",
        "Hey there! Struggling with {topic}? We totally get it. That's why we created this awesome {service} that actually works. No fluff, just results.",
        "Your {topic} problems end here! Our {service} is like having a superpower – but way more practical and definitely more fun to use."
      ],
      urgent: [
        "URGENT: Your {topic} success depends on taking action NOW. Limited availability - secure your competitive edge before it's too late!",
        "Time is running out! Don't miss this opportunity to revolutionize your {topic}. Act fast - this offer expires soon!",
        "LAST CHANCE: Transform your {topic} today or watch competitors leave you behind. The clock is ticking!"
      ]
    },
    social_post: {
      professional: [
        "Exciting developments in {topic}! Our team has been working on something that's going to change how businesses approach {service}. More details coming soon. #Innovation #Growth",
        "Proud to share our latest insights on {topic}. When strategy meets execution, extraordinary results follow. What's your take on the future of {service}? #ThoughtLeadership",
        "The landscape of {topic} is evolving rapidly. Companies that adapt their {service} approach now will lead tomorrow. Here's what we're seeing... #IndustryTrends"
      ],
      casual: [
        "Can we talk about {topic} for a sec? 🤔 Just discovered this game-changing approach to {service} and I'm honestly mind-blown. Anyone else seeing this trend? #Mindblown",
        "Friday thoughts: {topic} doesn't have to be complicated! Sometimes the best {service} solutions are the simplest ones. What's working for you? 💭",
        "Hot take: Most {topic} advice is overthinking it. Here's what actually works for {service}... (thread below) 🧵"
      ],
      inspirational: [
        "Every challenge in {topic} is an opportunity in disguise. Today's struggles become tomorrow's strengths. Keep pushing forward with your {service} goals! 💪",
        "The difference between dreaming and achieving in {topic}? Taking that first step with {service}. Your future self will thank you for starting today. ✨",
        "Remember: every expert in {topic} was once a beginner. Your {service} journey starts with believing in what's possible. You've got this! 🌟"
      ]
    },
    email: {
      professional: [
        "Subject: Important Update Regarding Your {topic}\n\nDear [Name],\n\nI hope this message finds you well. I wanted to personally reach out regarding the {service} opportunities we discussed.\n\nOur analysis shows significant potential for improvement in your {topic} strategy...",
        "Subject: Exclusive Insights for {topic} Success\n\nHi [Name],\n\nAs a valued client, you're among the first to receive our latest research on {topic} optimization.\n\nOur {service} team has identified three key trends...",
        "Subject: Your {topic} Performance Review\n\nDear [Name],\n\nI'm pleased to share the results of our comprehensive {topic} analysis for your organization.\n\nThe data reveals several opportunities for {service} enhancement..."
      ],
      urgent: [
        "Subject: URGENT: Your {topic} Requires Immediate Attention\n\n[Name], this can't wait.\n\nWe've detected critical issues with your {topic} that need immediate resolution. Without prompt action, you risk...",
        "Subject: Time-Sensitive: {topic} Deadline Approaching\n\n[Name], we have less than 48 hours to optimize your {service} before the deadline.\n\nImmediate action required...",
        "Subject: FINAL NOTICE: Your {topic} Opportunity Expires Today\n\n[Name], this is your last chance to secure these {service} benefits.\n\nDon't let this opportunity slip away..."
      ]
    }
  };

  // Generate 2-3 variations based on input
  const baseTemplates = templates[type]?.[tone] || templates[type]?.professional || [];
  
  for (let i = 0; i < Math.min(3, baseTemplates.length); i++) {
    const template = baseTemplates[i];
    let content = template
      .replace(/\{topic\}/g, extractTopic(brief))
      .replace(/\{service\}/g, extractService(brief));
    
    variations.push({
      content: content,
      metrics: generateMetrics(type)
    });
  }
  
  // If no templates found, generate generic content
  if (variations.length === 0) {
    variations.push({
      content: `Generated ${type.replace('_', ' ')} content with ${tone} tone for: ${brief}`,
      metrics: generateMetrics(type)
    });
  }
  
  return variations;
};

// Helper to extract main topic from brief
const extractTopic = (brief) => {
  const words = brief.toLowerCase().split(' ');
  const commonTopics = ['marketing', 'fitness', 'business', 'technology', 'health', 'education', 'finance', 'travel'];
  const foundTopic = commonTopics.find(topic => brief.toLowerCase().includes(topic));
  return foundTopic || 'your business';
};

// Helper to extract service type from brief
const extractService = (brief) => {
  if (brief.toLowerCase().includes('app')) return 'app';
  if (brief.toLowerCase().includes('product')) return 'product';
  if (brief.toLowerCase().includes('service')) return 'service';
  if (brief.toLowerCase().includes('platform')) return 'platform';
  if (brief.toLowerCase().includes('solution')) return 'solution';
  return 'offering';
};

// Helper to generate realistic metrics by content type
const generateMetrics = (type) => {
  const baseMetrics = {
    ad_copy: { ctr: Math.round((Math.random() * 5 + 2) * 100) / 100, conversionRate: Math.round((Math.random() * 3 + 1) * 100) / 100 },
    social_post: { engagementRate: Math.round((Math.random() * 20 + 5) * 100) / 100, shareRate: Math.round((Math.random() * 15 + 2) * 100) / 100 },
    email: { openRate: Math.round((Math.random() * 30 + 20) * 100) / 100, clickRate: Math.round((Math.random() * 15 + 5) * 100) / 100 },
    landing_page: { conversionRate: Math.round((Math.random() * 10 + 5) * 100) / 100, bounceRate: Math.round((Math.random() * 40 + 20) * 100) / 100 },
    blog_post: { readTime: Math.floor(Math.random() * 8 + 3) + ' min', shareRate: Math.round((Math.random() * 25 + 5) * 100) / 100 }
  };
  
  return baseMetrics[type] || { score: Math.round((Math.random() * 50 + 50) * 100) / 100 };
};

const contentService = {
  // Get all content items
  async getAll() {
    await delay(300);
    return [...contentData];
  },

  // Get content item by ID
  async getById(id) {
    await delay(300);
    const item = contentData.find(content => content.Id === parseInt(id));
    if (!item) {
      throw new Error('Content not found');
    }
    return { ...item };
  },

  // Create new content item
  async create(contentData) {
    await delay(300);
    
    const newContent = {
      Id: Date.now(), // Simple ID generation for mock
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would save to database
    // For mock purposes, we return the created item
    return { ...newContent };
  },

  // Update existing content item
  async update(id, updates) {
    await delay(300);
    
    const existingIndex = contentData.findIndex(content => content.Id === parseInt(id));
    if (existingIndex === -1) {
      throw new Error('Content not found');
    }
    
    const updatedContent = {
      ...contentData[existingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // In mock implementation, return the updated item
    return { ...updatedContent };
  },

  // Delete content item
  async delete(id) {
    await delay(300);
    
    const existingIndex = contentData.findIndex(content => content.Id === parseInt(id));
    if (existingIndex === -1) {
      throw new Error('Content not found');
    }
    
    // In a real implementation, this would delete from database
    return { success: true, message: 'Content deleted successfully' };
  },

  // Generate AI content - special method for content generation
  async generateContent({ brief, type, tone }) {
    await delay(800); // Longer delay to simulate AI processing
    
    if (!brief || !type || !tone) {
      throw new Error('Brief, type, and tone are required for content generation');
    }
    
    const generatedContent = generateContentVariations(brief, type, tone);
    
    return {
      brief,
      type,
      tone,
      generatedContent,
      generatedAt: new Date().toISOString()
    };
  },

  // Get content by status
  async getByStatus(status) {
    await delay(300);
    return contentData.filter(content => content.status === status).map(item => ({ ...item }));
  },

  // Get content by type
  async getByType(type) {
    await delay(300);
    return contentData.filter(content => content.type === type).map(item => ({ ...item }));
  },

  // Search content
  async search(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return contentData.filter(content => 
      content.brief.toLowerCase().includes(searchTerm) ||
      content.generatedContent.some(gc => gc.content.toLowerCase().includes(searchTerm))
    ).map(item => ({ ...item }));
  }
};

export default contentService;