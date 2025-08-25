import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const AIInsightsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("insights");
  const [actionItems, setActionItems] = useState([]);

  // Mock data for AI insights - in real app, this would come from an API
  const insights = [
    {
      id: 1,
      type: "performance",
      title: "Campaign Performance Alert",
      description: "Your LinkedIn campaigns are showing 34% higher CTR than industry average. Consider scaling successful ad sets.",
      impact: "high",
      metric: "+34% CTR",
      icon: "TrendingUp",
      color: "green"
    },
    {
      id: 2,
      type: "optimization",
      title: "Budget Optimization Opportunity",
      description: "Reallocating 15% budget from underperforming Facebook ads to top LinkedIn campaigns could increase ROAS by 18%.",
      impact: "medium",
      metric: "+18% ROAS",
      icon: "Target",
      color: "blue"
    },
    {
      id: 3,
      type: "audience",
      title: "Audience Expansion Recommended",
      description: "Similar audiences to your highest converting segment show 67% match rate. Expansion could 2x your reach.",
      impact: "high",
      metric: "2x Reach",
      icon: "Users",
      color: "purple"
    },
    {
      id: 4,
      type: "timing",
      title: "Optimal Posting Schedule",
      description: "Your audience is most active on Tuesdays and Thursdays, 2-4 PM. Scheduling posts during these times could improve engagement by 25%.",
      impact: "medium",
      metric: "+25% Engagement",
      icon: "Clock",
      color: "orange"
    }
  ];

  const recommendations = [
    {
      id: 1,
      category: "Budget Management",
      title: "Increase Q4 Holiday Budgets",
      description: "Historical data shows 40% higher conversion rates during holiday season. Recommend increasing budgets by 25-30%.",
      priority: "high",
      expectedImpact: "+40% Conversions",
      timeframe: "Next 2 weeks"
    },
    {
      id: 2,
      category: "Creative Strategy",
      title: "A/B Test Video Creatives",
      description: "Video content is showing 3x higher engagement. Test video variations of your top static ads.",
      priority: "medium",
      expectedImpact: "+200% Engagement",
      timeframe: "This week"
    },
    {
      id: 3,
      category: "Targeting",
      title: "Implement Lookalike Audiences",
      description: "Create lookalike audiences based on your highest LTV customers for similar high-quality leads.",
      priority: "high",
      expectedImpact: "+150% Lead Quality",
      timeframe: "Next 3 days"
    }
  ];

  const todayActionItems = [
    {
      id: 1,
      task: "Review LinkedIn Campaign Performance",
      description: "Check yesterday's metrics and adjust bids for underperforming ad sets",
      priority: "high",
      estimatedTime: "15 min",
      completed: false
    },
    {
      id: 2,
      task: "Launch New Facebook Lookalike Audience",
      description: "Create and launch lookalike audience based on Q3 top converters",
      priority: "high",
      estimatedTime: "30 min",
      completed: false
    },
    {
      id: 3,
      task: "Update Creative Assets",
      description: "Replace low-performing ad creatives with new holiday-themed variants",
      priority: "medium",
      estimatedTime: "45 min",
      completed: false
    },
    {
      id: 4,
      task: "Schedule Social Media Posts",
      description: "Queue up this week's social content during optimal posting times",
      priority: "medium",
      estimatedTime: "20 min",
      completed: false
    },
    {
      id: 5,
      task: "Analyze Competitor Activity",
      description: "Review competitor ad strategies and identify new opportunities",
      priority: "low",
      estimatedTime: "25 min",
      completed: false
    }
  ];

  useEffect(() => {
    setActionItems(todayActionItems);
  }, []);

  const handleCompleteTask = (taskId) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
    const task = actionItems.find(item => item.id === taskId);
    if (task && !task.completed) {
      toast.success("Task marked as completed!");
    } else {
      toast.info("Task marked as incomplete");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high": return "text-green-600 bg-green-50";
      case "medium": return "text-blue-600 bg-blue-50";
      case "low": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getIconColor = (color) => {
    const colors = {
      green: "text-green-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      orange: "text-orange-600"
    };
    return colors[color] || "text-gray-600";
  };

  if (!isOpen) return null;

  const completedTasks = actionItems.filter(item => item.completed).length;
  const totalTasks = actionItems.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Brain" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 font-display">
                AI Insights & Recommendations
              </h2>
              <p className="text-sm text-gray-600">
                Personalized insights for {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "insights", label: "Performance Insights", icon: "BarChart3" },
            { key: "recommendations", label: "Recommendations", icon: "Lightbulb" },
            { key: "actions", label: "Today's Actions", icon: "CheckSquare" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200",
                activeTab === tab.key
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.key === "actions" && (
                <Badge size="sm" variant="secondary">
                  {completedTasks}/{totalTasks}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "insights" && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Performance Insights</h3>
                <p className="text-gray-600 text-sm">AI-powered analysis of your campaign performance and opportunities</p>
              </div>
              
              {insights.map((insight) => (
                <Card key={insight.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", 
                      insight.color === "green" ? "bg-green-100" :
                      insight.color === "blue" ? "bg-blue-100" :
                      insight.color === "purple" ? "bg-purple-100" :
                      "bg-orange-100"
                    )}>
                      <ApperIcon name={insight.icon} className={cn("w-5 h-5", getIconColor(insight.color))} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={insight.impact === "high" ? "success" : "secondary"} size="sm">
                            {insight.impact} impact
                          </Badge>
                          <span className={cn("px-2 py-1 rounded text-xs font-medium", getImpactColor(insight.impact))}>
                            {insight.metric}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Recommendations</h3>
                <p className="text-gray-600 text-sm">Data-driven suggestions to optimize your marketing performance</p>
              </div>
              
              {recommendations.map((rec) => (
                <Card key={rec.id} className="p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <Badge variant={getPriorityColor(rec.priority)} size="sm">
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Target" size={12} />
                          <span>Expected: {rec.expectedImpact}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={12} />
                          <span>{rec.timeframe}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Tag" size={12} />
                          <span>{rec.category}</span>
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" icon="ArrowRight">
                      Implement
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Action Items</h3>
                    <p className="text-gray-600 text-sm">Prioritized tasks to maximize your marketing impact</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{completedTasks}/{totalTasks}</div>
                    <div className="text-xs text-gray-500">Tasks Completed</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  />
                </div>
              </div>
              
              {actionItems.map((item) => (
                <Card key={item.id} className={cn(
                  "p-4 transition-all duration-200",
                  item.completed ? "bg-green-50 border-green-200" : "hover:shadow-md"
                )}>
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleCompleteTask(item.id)}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors duration-200",
                        item.completed 
                          ? "bg-green-500 border-green-500" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {item.completed && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={cn(
                          "font-semibold",
                          item.completed ? "text-green-900 line-through" : "text-gray-900"
                        )}>
                          {item.task}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(item.priority)} size="sm">
                            {item.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.estimatedTime}</span>
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm",
                        item.completed ? "text-green-700" : "text-gray-600"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Sparkles" size={14} />
            <span>Insights updated every 4 hours</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Download">
              Export Report
            </Button>
            <Button variant="outline" size="sm" icon="RefreshCw">
              Refresh Data
            </Button>
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsModal;