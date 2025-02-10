import React, { useState } from "react";
import "./style.css";
import { baseUrl } from "../../utils/baseUrl";
import Toast from "../../components/toast";
import CustomTable from "../../components/table";

function CheckCard() {
  const [toast, setToast] = useState(false);
  const [cardCode, setCardCode] = useState(""); 
  const [cardDetails, setCardDetails] = useState(null); 

  const handleInputChange = (e) => {
    setCardCode(e.target.value);
  };

  const handleCheckCard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl + "subscriptions/check_card.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_code: cardCode }),
      });

      const data = await response.json();
      setCardDetails(data);
      setToast({ type: "success", message: "Card details fetched successfully!" });
    } catch (err) {
      setCardDetails(null);
      setToast({ type: "error", message: "Failed to fetch card details." });
    }
  };

  const columns = [
    { key: "card_code", title: "Card Code", dataIndex: "card_code" },
    { key: "student_name", title: "Student Name", dataIndex: "student_name" },
    { key: "student_", title: "Student ", dataIndex: "student_" },
    { key: "student_phone", title: "Student Phone", dataIndex: "student_phone" },
    { key: "school_name", title: "School Name", dataIndex: "school_name" },
    { key: "student_governce", title: "Governance", dataIndex: "student_governce" },
    { key: "name", title: "Package Name", dataIndex: "name" },
    { key: "price", title: "Price", dataIndex: "price" },
    { key: "group_name", title: "Group Name", dataIndex: "group_name" },
    { key: "doctor_name", title: "Doctor Name", dataIndex: "doctor_name" },
    { key: "type", title: "Type", dataIndex: "type" },
  ];

  return (
    <div className="check-card">
      <div className="cardCheckForm">
        <h1 className="pageTitle">Check Card</h1>
        <form onSubmit={handleCheckCard}>
          <div className="form-group">
            <label htmlFor="cardCode">Card Code</label>
            <input
              type="text"
              id="cardCode"
              name="cardCode"
              value={cardCode}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter card code"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Check Card
          </button>
        </form>
      </div>

      {cardDetails && (
        <CustomTable dataSource={[cardDetails]} columns={columns} />
      )}

      {toast && (
        <Toast message={toast?.message} type={toast?.type} onClose={setToast} />
      )}
    </div>
  );
}

export default CheckCard;
