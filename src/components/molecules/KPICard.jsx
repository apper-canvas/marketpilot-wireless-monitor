import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = "percentage",
  icon, 
  trend = "up",
  className,
  loading = false 
}) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  const formatChange = () => {
    if (!change) return null;
    const prefix = changeType === "percentage" ? "" : "$";
    const suffix = changeType === "percentage" ? "%" : "";
    return `${change > 0 ? "+" : ""}${prefix}${change}${suffix}`;
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-100 rounded w-16"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-5 h-5 text-primary-600" />
          </div>
        )}
        <div className="flex items-center space-x-1">
          <ApperIcon 
            name={getTrendIcon()} 
            className={cn("w-4 h-4", getTrendColor())} 
          />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 leading-tight">
          {title}
        </h3>
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        {change && (
          <div className="flex items-center space-x-2">
            <Badge 
              variant={trend === "up" ? "success" : trend === "down" ? "error" : "default"}
              size="sm"
            >
              {formatChange()}
            </Badge>
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPICard;