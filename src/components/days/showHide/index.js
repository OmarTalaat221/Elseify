import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function ShowHideDays({ openModal, setOpenModal }) {
  const [dayData, setDayData] = useState({
    dayName: openModal?.dayName,
    hidden: openModal?.hidden,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!dayData?.loading) {
      setDayData({ ...dayData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.id}`, {
          hidden: !dayData.hidden,
        })
        .then((res) => {
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to update day visibility:", err);
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
        hidden: openModal.hidden,
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={dayData.hidden ? "Show Day" : "Hide Day"}
      visible={!!openModal}
    >
      <div className="showhide-warning">
        <h3>{dayData.hidden ? "Show Day" : "Hide Day"}</h3>
        <p className="warning-message">
          Are you sure you want to {dayData.hidden ? "show" : "hide"} this
          day? This action will update the visibility status of the day.
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
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {dayData.hidden ? "Show" : "Hide"}
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

export default ShowHideDays;
