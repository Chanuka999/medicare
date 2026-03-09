import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "../../services/api";

const MonthlyRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMonthlyRevenue();
      setData(response.data.data.monthlyRevenue);
    } catch (error) {
      console.error("Failed to load monthly revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading chart...</div>;

  return (
    <div className="chart-container">
      <h3>Monthly Revenue (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="month"
            stroke="var(--text-secondary)"
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            stroke="var(--text-secondary)"
            style={{ fontSize: "0.875rem" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: `1px solid var(--border-color)`,
              borderRadius: "6px",
            }}
            labelStyle={{ color: "var(--text-main)" }}
            formatter={(value) => [`Rs. ${value.toFixed(2)}`, "Revenue"]}
          />
          <Legend wrapperStyle={{ color: "var(--text-main)" }} />
          <Bar
            dataKey="revenue"
            fill="#10b981"
            name="Revenue (Rs.)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;
