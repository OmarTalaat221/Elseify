import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function EditDays({ getFunction, openModal, setOpenModal }) {
  const [dayData, setDayData] = useState({
    dayName: openModal?.dayName,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const saveEditedDay = (e) => {
    e.preventDefault();
    if (!dayData?.loading) {
      setDayData({ ...dayData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.id}`, { dayName: dayData.dayName }) 
        .then((res) => {
          getFunction(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
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
      title={"Edit Day"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveEditedDay(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="animated-label">
            Enter Day Name
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="Day Name"
            value={dayData?.dayName}
            onChange={(e) => setDayData({ ...dayData, dayName: e.target.value })}
            className="animated-input"
          />
        </div>
        <div className="rowEndDiv">
          {dayData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"No Data Passed"}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default EditDays;
