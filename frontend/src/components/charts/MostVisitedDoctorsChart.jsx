import React, { useState, useEffect } from "react";
import { adminService } from "../../services/api";

const MostVisitedDoctorsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMostVisitedDoctors();
      setData(response.data.data.doctors);
    } catch (error) {
      console.error("Failed to load most visited doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading...</div>;

  return (
    <div className="chart-container">
      <h3>Top 10 Most Visited Doctors</h3>
      <div className="doctors-table-wrapper">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Appointments</th>
              <th>Completed</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((doctor, index) => (
                <tr
                  key={doctor._id}
                  className={index % 2 === 0 ? "even-row" : ""}
                >
                  <td>
                    <strong>{doctor.doctorName || "N/A"}</strong>
                  </td>
                  <td>{doctor.specialization || "N/A"}</td>
                  <td>
                    <span className="badge-count">
                      {doctor.appointmentCount}
                    </span>
                  </td>
                  <td>
                    <span className="badge-success">
                      {doctor.completedCount}
                    </span>
                  </td>
                  <td>
                    <div className="completion-rate-bar">
                      <div
                        className="completion-rate-fill"
                        style={{ width: `${doctor.completionRate}%` }}
                      ></div>
                      <span className="rate-text">
                        {doctor.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MostVisitedDoctorsChart;
