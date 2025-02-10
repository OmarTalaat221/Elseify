import React, { useEffect, useState } from "react";
import AddSubscriptionCards from "../../components/SubscriptionCards/add";
import "./style.css";
import Groups from './../groups/index';

function SubscriptionCards() {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState();
  useEffect(() => {
    try {
      setUserData(JSON.parse(localStorage.getItem("moreenglishlogin")));
    } catch (err) {}
  }, [localStorage]);
  return (
    <div className="subscriptionCardss">
      <div className="tablePageHeader">
        <h1 className="pageTitle">SubscriptionCards</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add SubscriptionCards
        </button>
      </div>
      {/* <CustomTable dataSource={initialSubscriptionCardsData} columns={columns} /> */}
      <AddSubscriptionCards userData={userData} openModal={openModal} setOpenModal={setOpenModal} />


    </div>
  );
}

export default SubscriptionCards;
