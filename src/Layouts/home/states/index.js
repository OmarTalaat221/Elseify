
import React from "react";
import StateCard from "../../../components/home/stateComponent";
import StatisticsCharts from "../../../components/home/StatisticsCharts";
import "./style.css";
import { sampleStats } from "../../../data/home/charts";

const Statistics = () => {
  const stats = [
    { title: "Number of Years", value: "5", icon: "📅" },
    { title: "Number of Groups", value: "25", icon: "👥" },
    { title: "Number of Students", value: "1,200", icon: "🎓" },
    { title: "Income", value: "$30,000", icon: "💵" },
    { title: "Subscription Numbers", value: "500", icon: "🔢" },
    { title: "Expired Subscriptions", value: "80", icon: "🔚" },
  ];

  return (
    <>
      <div className="statistics-container">
        {stats.map((stat, index) => (
          <StateCard key={index} stat={stat} />
        ))}
      </div>
      <StatisticsCharts stats={sampleStats} />
    </>
  );
};

export default Statistics;
