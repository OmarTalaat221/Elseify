import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import "./style.css";

function DeleteScore({ scoreId, openModal, setOpenModal, getScores }) {
  const [scoreData, setScoreData] = useState({
    score: openModal?.score,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  
  useEffect(() => {
    if (openModal) {
      setScoreData({
        score: openModal?.score,
        loading: false,
      });
    }
  }, [openModal]);

  
  const deleteScore = (e) => {
    e.preventDefault();
    if (!scoreData?.loading) {
      setScoreData({ ...scoreData, loading: true });
      setToast(true);
      
      axios
        .delete(`/api/scores/${scoreId}`) 
        .then(() => {
          getScores(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setScoreData({ ...scoreData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Score"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this score?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following score:
        </p>
        <div className="score-details">
          <strong>Score:</strong> {scoreData?.score}
        </div>
        <div className="rowEndDiv">
          {scoreData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteScore}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
        {toast && (
          <Toast
            message={"An error occurred. Please try again."}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </div>
    </Modal>
  );
}

export default DeleteScore;
