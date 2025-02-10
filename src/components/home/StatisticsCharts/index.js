import React, { useState } from "react";
import { Bar, Line, Pie, Doughnut, Radar, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,

  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import "./StatisticsCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

const StatisticsCharts = ({ stats }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredStats = stats.filter((stat) => {
    const statDate = new Date(stat.date);
    return (
      (!startDate || statDate >= startDate) && (!endDate || statDate <= endDate)
    );
  });

  const barData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        label: "Total Views",
        data: filteredStats.map((stat) =>
          parseInt(stat.value.replace(/[^0-9]/g, ""))
        ),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const lineData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        label: "User Engagement",
        data: filteredStats.map((stat) => Math.floor(Math.random() * 100)),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const pieData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        data: filteredStats.map((stat) =>
          parseInt(stat.value.replace(/[^0-9]/g, ""))
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        data: filteredStats.map((stat) =>
          parseInt(stat.value.replace(/[^0-9]/g, ""))
        ),
        backgroundColor: [
          "rgba(255, 159, 64, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };
  const areaData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        label: "Cumulative Engagement",
        data: filteredStats.map((stat) =>
          parseInt(stat.value.replace(/[^0-9]/g, ""))
        ),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const radarData = {
    labels: filteredStats.map((stat) => stat.title),
    datasets: [
      {
        label: "Performance",
        data: filteredStats.map((stat) =>
          parseInt(stat.value.replace(/[^0-9]/g, ""))
        ),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 206, 86, 1)",
      },
    ],
  };

  return (
    <div className="statistics-charts-grid">
      <div className="chart-container">
        <h4 className="chart-title">Total Course Views (Bar Chart)</h4>
        <Bar data={barData} options={{ ntainAspectRatio: false }} />
      </div>

      <div className="chart-container">
        <h4 className="chart-title">User Engagement (Line Chart)</h4>
        <Line data={lineData} options={{ AspectRatio: false }} />
      </div>

      <div className="chart-container">
        <h4 className="chart-title">Content Popularity (Pie Chart)</h4>
        <Pie data={pieData} options={{ AspectRatio: false }} />
      </div>

      <div className="chart-container">
        <h4 className="chart-title">Average Quiz Score (Doughnut Chart)</h4>
        <Doughnut
          data={doughnutData}
          options={{ AspectRatio: false }}
        />
      </div>

      <div className="chart-container">
        <h4 className="chart-title">Student Performance (Radar Chart)</h4>
        <Radar data={radarData} options={{ AspectRatio: false }} />
      </div>
      <div className="chart-container">
      <h4 className="chart-title">Cumulative Engagement (Area Chart)</h4>
      <Line data={areaData} options={{ AspectRatio: false }} />
    </div>
    </div>
  );
};

export default StatisticsCharts;
