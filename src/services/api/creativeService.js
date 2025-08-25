import creativeData from "@/services/mockData/creative.json";

const creativeService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Return a copy of the data to prevent mutations
    return creativeData.map(content => ({ ...content }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const content = creativeData.find(item => item.Id === parseInt(id));
    if (!content) {
      throw new Error("Creative content not found");
    }
    
    return { ...content };
  },

  async create(newContent) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...creativeData.map(c => c.Id)) + 1;
    const content = {
      Id: newId,
      ...newContent,
      createdAt: new Date().toISOString()
    };
    
    creativeData.push(content);
    return { ...content };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = creativeData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Creative content not found");
    }
    
    const updatedContent = { 
      ...creativeData[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    creativeData[index] = updatedContent;
    
    return { ...updatedContent };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = creativeData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Creative content not found");
    }
    
    const deletedContent = creativeData.splice(index, 1)[0];
    return { ...deletedContent };
  },

  async generateCreative(params) {
    // Simulate AI creative generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockContent = this.generateMockCreative(params.type, params.platform, params.tone, params.brief, params.imageStyle);
    const complianceCheck = this.checkCompliance(mockContent, params.platform, params.type);
    
    return {
      content: mockContent,
      imageUrls: this.generateMockImages(params.imageStyle, params.type),
      imageDescriptions: this.generateImageDescriptions(params.type, params.brief),
      complianceStatus: complianceCheck.status,
      complianceIssues: complianceCheck.issues
    };
  },

  generateMockCreative(type, platform, tone, brief, imageStyle) {
    const templates = {
      ad_copy: {
        facebook: {
          professional: `Transform your business with cutting-edge solutions tailored for ${brief.includes("small") ? "growing companies" : "industry leaders"}. Our proven methodology delivers measurable results that drive sustainable growth.\n\nKey Benefits:\n✓ Advanced analytics and insights\n✓ Expert guidance and support\n✓ Scalable solutions for any size business\n\nJoin thousands of successful businesses who trust our platform. Start your free trial today and experience the difference professional-grade tools can make.\n\n[Learn More] [Start Free Trial]`,
          casual: `Hey there! 👋 Looking to level up your ${brief.includes("marketing") ? "marketing game" : "business"}?\n\nWe've got something pretty awesome that's helping tons of businesses just like yours get amazing results! 🚀\n\n• Super easy to use (seriously, anyone can do it!)\n• See results fast ⚡\n• Amazing support team always ready to help\n\nThousands of happy customers can't be wrong! Why not give it a try? \n\n➡️ Click to get started (it's free!) ⬅️`,
          luxury: `Discover the pinnacle of ${brief.includes("premium") ? "premium excellence" : "sophisticated solutions"}.\n\nCrafted for discerning professionals who demand nothing but the finest, our exclusive platform delivers unparalleled performance and prestige.\n\nExperience:\n• Bespoke solutions tailored to your vision\n• White-glove service and support\n• Exclusive access to premium features\n\nElevate your standards. Embrace excellence.\n\n[Request Private Demo]`
        }
      },
      social_post: {
        instagram: {
          casual: `✨ Behind the scenes magic happening! ✨\n\nWe've been working on something INCREDIBLE and honestly, we can barely contain our excitement! 😍\n\n${brief.includes("product") ? "This new product" : "What we're building"} is going to change everything for ${brief.includes("small") ? "small business owners" : "our amazing community"}! 🙌\n\nStay tuned for the big reveal... trust us, you don't want to miss this! 👀\n\n#ComingSoon #Innovation #Excited #CommunityLove #SmallBusiness #Entrepreneur`,
          professional: `Industry Innovation Alert 📊\n\nWe're proud to announce our latest advancement in ${brief.includes("AI") ? "artificial intelligence technology" : "business solutions"}. This breakthrough represents months of dedicated research and development.\n\nKey highlights:\n• Enhanced performance metrics\n• Streamlined user experience  \n• Industry-leading security standards\n• Scalable enterprise solutions\n\nThis innovation reinforces our commitment to delivering exceptional value to our clients and partners.\n\n#Innovation #Technology #BusinessGrowth #Industry #Leadership`
        }
      },
      email: {
        professional: `Subject: Introducing Our Latest Innovation - Exclusive Preview\n\nDear [Name],\n\nI hope this message finds you well. I'm excited to share something remarkable that our team has been developing specifically with businesses like yours in mind.\n\n${brief.includes("solution") ? "Our newest solution" : "This innovation"} addresses the key challenges you've shared with us:\n\n✓ Streamlined operations and efficiency\n✓ Enhanced performance tracking\n✓ Simplified user experience\n✓ Robust security and compliance\n\nAs one of our valued clients, you're among the first to receive exclusive access to this breakthrough technology.\n\nWould you be available for a brief 15-minute demo this week? I'd love to show you how this can specifically benefit your organization.\n\nBest regards,\n[Your Name]\nP.S. Early adopters are seeing remarkable results - I can't wait to share the details with you.`
      }
    };

    // Get appropriate template based on type, platform, and tone
    let content = templates[type]?.[platform]?.[tone] || 
                 templates[type]?.facebook?.[tone] || 
                 templates.ad_copy.facebook.professional;

    return content;
  },

  generateMockImages(style, type) {
    // Simulate different numbers of images based on content type
    const imageCount = type === "banner_ad" ? 3 : type === "social_post" ? 2 : 4;
    return Array(imageCount).fill().map((_, i) => `/mock-image-${style}-${i + 1}.jpg`);
  },

  generateImageDescriptions(type, brief) {
    const baseDescriptions = {
      ad_copy: [
        "Professional hero image with modern typography overlay",
        "Clean product showcase with minimal background",
        "Dynamic action shot emphasizing key benefits",
        "Lifestyle image showing product in real-world context"
      ],
      social_post: [
        "Eye-catching graphic with bold colors and engaging text",
        "Behind-the-scenes candid moment with authentic feel"
      ],
      email: [
        "Header banner with consistent brand styling",
        "Product feature highlights in grid layout",
        "Call-to-action focused imagery with clear messaging"
      ],
      landing_copy: [
        "Compelling hero banner with strong visual hierarchy",
        "Feature comparison infographic",
        "Customer testimonial with portrait",
        "Trust signals and security badges layout"
      ],
      banner_ad: [
        "Animated banner with smooth transitions",
        "Static display version with high contrast",
        "Mobile-optimized responsive variant"
      ]
    };

    return baseDescriptions[type] || baseDescriptions.ad_copy;
  },

  checkCompliance(content, platform, type) {
    const issues = [];
    
    // Platform-specific compliance checks
    if (platform === "facebook") {
      if (content.length > 2200) {
        issues.push({
          type: "Length Violation",
          message: "Content exceeds Facebook's recommended character limit",
          suggestion: "Consider shortening the copy to improve engagement"
        });
      }
      
      if (content.includes("Click here") || content.includes("click now")) {
        issues.push({
          type: "Policy Warning", 
          message: "Generic call-to-action may affect ad approval",
          suggestion: "Use more specific action words like 'Learn More' or 'Get Started'"
        });
      }
    }
    
    if (platform === "google_ads") {
      if (content.includes("!") && (content.match(/!/g) || []).length > 1) {
        issues.push({
          type: "Editorial Policy",
          message: "Excessive punctuation may affect ad quality score",
          suggestion: "Limit exclamation marks to maintain professional tone"
        });
      }
    }
    
    // Content type specific checks
    if (type === "email") {
      if (!content.includes("unsubscribe") && !content.includes("opt-out")) {
        issues.push({
          type: "CAN-SPAM Compliance",
          message: "Email missing required unsubscribe information",
          suggestion: "Add unsubscribe link and physical address"
        });
      }
    }
    
    // Determine overall compliance status
    let status = "approved";
    if (issues.length > 0) {
      const hasHighRisk = issues.some(issue => 
        issue.type.includes("Policy") || 
        issue.type.includes("CAN-SPAM") ||
        issue.type.includes("Violation")
      );
      status = hasHighRisk ? "rejected" : "warning";
    }
    
    return { status, issues };
  }
};

export default creativeService;