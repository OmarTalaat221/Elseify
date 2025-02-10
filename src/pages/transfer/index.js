import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../components/table";
import Loader from "../../components/loader";
import { baseUrl } from "../../utils/baseUrl";

function CheckTransferMoney() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transfare_from: "vodafone", 
    source: "",
    amount: "",
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
    e.preventDefault()
    setLoading(true);
    try {
        
      const response = await fetch(
        baseUrl + "recive_money_verf/check_transfer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setTransfers(data);
    } catch (err) {
      setTransfers([]);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "trans_id",
      title: "Transaction ID",
      dataIndex: "trans_id",
    },
    {
      key: "transfare_from",
      title: "Transfer From",
      dataIndex: "transfare_from",
    },
    {
      key: "source",
      title: "Source Number",
      dataIndex: "source",
    },
    {
      key: "amount",
      title: "Amount",
      dataIndex: "amount",
    },
    {
      key: "student_phone",
      title: "Student Phone",
      dataIndex: "student_phone",
    },
    {
      key: "user_name",
      title: "User Name",
      dataIndex: "user_name",
    },
  ];

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
        <button onClick={handleTransfer} className="btn btn-primary">
          {loading ? <Loader size="sm" /> : "Check"}
        </button>
      </form>
      {transfers.length > 0 && (
        <CustomTable dataSource={transfers} columns={columns} />
      )}
    </div>
  );
}

export default CheckTransferMoney;
