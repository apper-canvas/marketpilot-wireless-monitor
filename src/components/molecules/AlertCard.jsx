import React from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const AlertCard = ({ 
  alert, 
  onResolve, 
  onDismiss,
  className 
}) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "error";
      case "warning": return "warning";
      case "info": return "info";
      default: return "default";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical": return "AlertTriangle";
      case "warning": return "AlertCircle";
      case "info": return "Info";
      default: return "Bell";
    }
  };

  const getAlertMessage = (alert) => {
    switch (alert.type) {
      case "budget_exceeded":
        return `Campaign budget exceeded by ${((alert.currentValue - alert.threshold) / alert.threshold * 100).toFixed(1)}%`;
      case "traffic_drop":
        return `Traffic dropped by ${Math.abs(alert.currentValue - alert.threshold)}% compared to yesterday`;
      case "cost_spike":
        return `Cost per click increased by ${((alert.currentValue - alert.threshold) / alert.threshold * 100).toFixed(1)}%`;
      case "conversion_drop":
        return `Conversion rate dropped to ${alert.currentValue}% (below ${alert.threshold}% threshold)`;
      default:
        return `${alert.metric} is ${alert.currentValue} (threshold: ${alert.threshold})`;
    }
  };

  return (
    <Card
    className={cn("border-l-4", {
        "border-l-red-500": alert.severity === "critical",
        "border-l-yellow-500": alert.severity === "warning",
        "border-l-blue-500": alert.severity === "info"
    }, className)}>
    <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
                <div
                    className={cn("w-8 h-8 rounded-full flex items-center justify-center", {
                        "bg-red-100": alert.severity === "critical",
                        "bg-yellow-100": alert.severity === "warning",
                        "bg-blue-100": alert.severity === "info"
                    })}>
                    <ApperIcon
                        name={getSeverityIcon(alert.severity)}
                        className={cn("w-4 h-4", {
                            "text-red-600": alert.severity === "critical",
                            "text-yellow-600": alert.severity === "warning",
                            "text-blue-600": alert.severity === "info"
                        })} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getSeverityColor(alert.severity)} size="sm">
                            {alert.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                            {alert?.timestamp && !isNaN(new Date(alert.timestamp).getTime()) ? format(new Date(alert.timestamp), "MMM dd, HH:mm") : "Unknown time"}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {alert.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {getAlertMessage(alert)}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-1 ml-4">
                {!alert.resolved && onResolve && <Button size="sm" variant="outline" onClick={() => onResolve(alert.Id)}>Resolve
                                </Button>}
                {onDismiss && <button
                    onClick={() => onDismiss(alert.Id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <ApperIcon name="X" className="w-4 h-4" />
                </button>}
            </div>
        </div>
    </div></Card>
  );
};

export default AlertCard;