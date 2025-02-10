import React, { useState } from "react";
import "./style.css";
import { datePickers, viewOptions } from "../../../data/home/stats";

function StateCard({ stat, index }) {
  const [view, setView] = useState("all");
  const [date, setDate] = useState({
    day: new Date().toISOString().substr(0, 10),
    month: new Date().toISOString().substr(0, 7),
    year: new Date().getFullYear(),
  });
  const [percentageChange, setPercentageChange] = useState(10);

  const handleViewChange = (newView) => {
    setView(newView);
    setPercentageChange(Math.floor(Math.random() * 20) - 10);
  };

  const handleDateChange = (e) => {
    const picker = datePickers.find((picker) => picker.key === view);
    if (picker && picker.onChange) {
      picker.onChange(e, setDate, date);
    }
  };

  return (
    <div className="stat-card" key={index}>
      <div className="view-controls">
        {viewOptions.map((option) => (
          <button
            key={option.key}
            className={`view-btn ${view === option.key ? "active" : "inactive"}`}
            onClick={() => handleViewChange(option.key)}
          >
            {option.icon} 
          </button>
        ))}
      </div>
      <div className="stat-icon">{stat.icon}</div>
      <h4 className="stat-title">{stat.title}</h4>
      <p className="stat-value">
        {stat.value} In ({view})
      </p>
      <div className="date-picker">
        {datePickers
          .filter((picker) => picker.key === view)
          .map((picker) => {
            if (picker.key === "all") {
              return picker.content;
            }
            return (
              <input
                key={picker.key}
                type={picker.type}
                value={picker.value(date)}
                className="datePickerState"
                onChange={handleDateChange}
                min={picker.min}
                max={picker.max}
              />
            );
          })}
      </div>
      <div className="trend-indicator">
        <span className={`trend-icon ${percentageChange >= 0 ? "up" : "down"}`}>
          {percentageChange >= 0 ? "📈" : "📉"}
        </span>
        <p className={`trend-percentage ${percentageChange >= 0 ? "up" : "down"}`}>
          {percentageChange}%
        </p>
      </div>
    </div>
  );
}

export default StateCard;
