import React, { useState, useEffect } from "react";
import KPICard from "@/components/molecules/KPICard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import kpiService from "@/services/api/kpiService";

const KPIGrid = ({ accountId, dateRange }) => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadKPIs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await kpiService.getKPIs(accountId, dateRange);
      setKpis(data);
    } catch (err) {
      setError("Failed to load KPI data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs();
  }, [accountId, dateRange]);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadKPIs} />;
  }

  const formatKPIValue = (kpi) => {
    switch (kpi.type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(kpi.value);
      case "percentage":
        return `${kpi.value.toFixed(1)}%`;
      case "number":
        return new Intl.NumberFormat("en-US").format(kpi.value);
      default:
        return kpi.value.toString();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.Id}
          title={kpi.name}
          value={formatKPIValue(kpi)}
          change={kpi.changePercent}
          trend={kpi.trend}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};

export default KPIGrid;