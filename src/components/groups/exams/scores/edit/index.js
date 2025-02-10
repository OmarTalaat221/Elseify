import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import "./style.css";

function EditScore({ scoreId, scroreData, openModal, setOpenModal, getScores }) {
  const [formData, setFormData] = useState({
    score: openModal?.score,
    score_id: openModal?.score_id,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  
  useEffect(() => {
    if (openModal) {
      setFormData({
        score: openModal?.score,
        score_id: openModal?.score_id,
        loading: false,
      });
    }
  }, [openModal]);

  
  const handleScoreChange = (e) => {
    setFormData({ ...formData, score: e.target.value });
  };

  
  const saveUpdatedScore = (e) => {
    e.preventDefault();
    if (!formData?.loading) {
      setFormData({ ...formData, loading: true });
      setToast(true);

      axios
        .put(`/api/scores/${scoreId}`, { score: formData.score })
        .then(() => {
          getScores(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFormData({ ...formData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Score"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedScore} className="animated-form">
        <div className="form-group">
          <label htmlFor="scoreInput" className="form-label">
            Score
          </label>
          <input
            type="number"
            id="scoreInput"
            placeholder="Enter Score"
            value={formData.score}
            onChange={handleScoreChange}
            className="form-input"
            min="0"
            max="100"
          />
        </div>
        <div className="form-footer">
          {formData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"Please fill out all required fields"}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default EditScore;
