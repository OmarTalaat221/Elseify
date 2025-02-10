import React from "react";
import Statistics from "../../Layouts/home/states";
import Subscriptions from "../../Layouts/home/latestSubscriptions";

function Home() {
  return (
    <div className="pageContainer">
      <Statistics />
      <Subscriptions />
    </div>
  );
}

export default Home;
