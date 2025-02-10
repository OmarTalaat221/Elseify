import React, { useState, useEffect } from "react";
import "./Welcome.css";

const Welcome = ({ username }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="welcome-container">
      <div className="welcome-text">
        <h2>
          Welcome, {"ElSeify"}
          <span role="img" aria-label="wave" className="wave-emoji">
            👋
          </span>
          !
        </h2>
        <p>{formattedDate} - {formattedTime}</p>
      </div>
    </div>
  );
};

export default Welcome;
