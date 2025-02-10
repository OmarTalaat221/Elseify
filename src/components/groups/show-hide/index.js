import React, {useEffect, useState} from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import {baseUrl} from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";


function ShowHideGroupModal({getFunction, openModal, setOpenModal}) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    hidden: openModal?.hidden,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!yearData?.loading) {
      setYearData({ ...yearData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.key}`, {
          hidden: !yearData.hidden,
        })
        .then((res) => {
          
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
          setToast(true); 
        })
        .finally(() => {
          setYearData({ ...yearData, loading: false });
        });
    }
  };

  useEffect(() => {
    setYearData({
      name: openModal?.grade,
      description: openModal?.description,
      hidden: openModal?.hidden,
      loading: false,
    });
  }, [openModal]);



  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={yearData.hidden ? "Show Group" : "Hide Group"}
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>{yearData.hidden ? "Show Group" : "Hide Group"}</h3>
        <p className="warning-message">
          Are you sure you want to {yearData.hidden ? "show" : "hide"} this
          group? This action will update the visibility status of the group.
        </p>
        <div className="year-details">
          <strong>Name:</strong> {yearData?.name}
        </div>
        <div className="year-details">
          <strong>Description:</strong> {yearData?.description}
        </div>
        <div className="rowEndDiv">
          {yearData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {yearData.hidden ? "Show" : "Hide"}
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

export default ShowHideGroupModal;
