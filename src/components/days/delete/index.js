import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function DeleteDay({ getFunction, openModal, setOpenModal }) {
  const [dayData, setDayData] = useState({
    dayName: openModal?.dayName,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const deleteDay = (e) => {
    e.preventDefault();
    if (!dayData?.loading) {
      setDayData({ ...dayData, loading: true });
      axios
        .delete(`your-api-endpoint/${openModal?.id}`) 
        .then((res) => {
          getFunction(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to delete day:", err);
          setToast(true);
        })
        .finally(() => {
          setDayData({ ...dayData, loading: false });
        });
    }
  };

  useEffect(() => {
    if (openModal) {
      setDayData({
        dayName: openModal.dayName,
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Day"}
      visible={!!openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this day?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following day:
        </p>
        <div className="day-details">
          <strong>Day Name:</strong> {dayData?.dayName}
        </div>
        <div className="rowEndDiv">
          {dayData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteDay}
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

export default DeleteDay;
