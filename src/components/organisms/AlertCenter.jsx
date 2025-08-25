import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import AlertCard from "@/components/molecules/AlertCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import alertService from "@/services/api/alertService";
const AlertCenter = ({ limit = null, showHeader = true }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await alertService.getAll();
      const sortedAlerts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAlerts(limit ? sortedAlerts.slice(0, limit) : sortedAlerts);
    } catch (err) {
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [limit]);

  const handleResolve = async (alertId) => {
    try {
      const updatedAlert = await alertService.update(alertId, { resolved: true });
      setAlerts(alerts.map(alert => 
        alert.Id === alertId ? updatedAlert : alert
      ));
      toast.success("Alert resolved successfully");
    } catch (err) {
      toast.error("Failed to resolve alert");
    }
  };

const handleDismiss = async (alertId) => {
    try {
      await alertService.delete(alertId);
      setAlerts(alerts.filter(alert => alert.Id !== alertId));
      toast.success("Alert dismissed");
    } catch (err) {
      toast.error("Failed to dismiss alert");
    }
  };
  const unreadAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = alerts.filter(alert => alert.severity === "critical");
  const competitorAlerts = alerts.filter(alert => alert.type?.includes("competitor"));
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAlerts} />;
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <Empty 
          variant="alerts"
          action={() => window.location.reload()}
        />
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Smart Alerts
            </h3>
            {unreadAlerts.length > 0 && (
              <Badge variant="error" size="sm">
                {unreadAlerts.length} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              icon="RefreshCw"
              onClick={loadAlerts}
            >
              Refresh
            </Button>
            {limit && alerts.length >= limit && (
              <Button
                size="sm"
                variant="outline"
                icon="ExternalLink"
              >
                View All
              </Button>
            )}
          </div>
        </div>
      )}

      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              {criticalAlerts.length} critical {criticalAlerts.length === 1 ? "alert" : "alerts"} requiring immediate attention
            </span>
</div>
        </div>
      )}
      {competitorAlerts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Eye" className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {competitorAlerts.length} competitor {competitorAlerts.length === 1 ? "alert" : "alerts"} detected
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.Id}
            alert={alert}
            onResolve={handleResolve}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
</Card>
  );
};

export default AlertCenter;