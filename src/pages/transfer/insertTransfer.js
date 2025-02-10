import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import { baseUrl } from "../../utils/baseUrl";

function TransferMoney() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transfare_from: "vodafone",
    source: "",
    amount: "",
    user_id: "",
    student_phone: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTransfer = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      const response = await fetch(
        baseUrl + "recive_money_verf/insert_trans.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({...formData, user_id: userData?.user_id}),
        }
      );
      const data = await response.text();
      alert(data);
      setFormData({
        transfare_from: "vodafone",
        source: "",
        amount: "",
        user_id: "",
        student_phone: "",
      });
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-money">
      <form action="" className="transerCheck">
        <div className="form-group">
          <label>Transfer From</label>
          <select
            name="transfare_from"
            value={formData.transfare_from}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="vodafone">Vodafone</option>
            <option value="insta">Insta</option>
          </select>
        </div>
        <div className="form-group">
          <label>Source Number</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter source number"
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label>Student Phone</label>
          <input
            type="text"
            name="student_phone"
            value={formData.student_phone}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter student phone"
          />
        </div>
        <button onClick={handleTransfer} className="btn btn-primary">
          {loading ? <Loader size="sm" /> : "Transfer Money"}
        </button>
      </form>
    </div>
  );
}

export default TransferMoney;
