import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "../../services/api";

const DailyAppointmentsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDailyAppointments();
      setData(response.data.data.dailyAppointments);
    } catch (error) {
      console.error("Failed to load daily appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading chart...</div>;

  return (
    <div className="chart-container">
      <h3>Daily Appointments (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="day"
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
          />
          <Legend wrapperStyle={{ color: "var(--text-main)" }} />
          <Line
            type="monotone"
            dataKey="appointments"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Appointments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyAppointmentsChart;
