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

const PatientGrowthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPatientGrowth();
      setData(response.data.data.patientGrowth);
    } catch (error) {
      console.error("Failed to load patient growth:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading chart...</div>;

  return (
    <div className="chart-container">
      <h3>Patient Growth (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
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
          />
          <Legend wrapperStyle={{ color: "var(--text-main)" }} />
          <Line
            type="monotone"
            dataKey="totalPatients"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Patients"
          />
          <Line
            type="monotone"
            dataKey="newPatients"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", r: 4 }}
            activeDot={{ r: 6 }}
            name="New Patients"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientGrowthChart;
