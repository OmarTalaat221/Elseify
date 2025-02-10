import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { baseUrl } from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";

function PauseStudent({ getFunction, openModal, setOpenModal }) {
  const [yearData, setYearData] = useState({
    reason: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = async (e) => {
    try {
      const response = await fetch(
        baseUrl +
          (openModal?.pause_status == "no"
            ? "absence/pause_student.php"
            : "absence/reasume_student.php"),
        {
          method: "POST",
          headers: { "Content-Type": "Application/Json" },
          body: JSON.stringify({
            student_id: openModal?.student_id,
            reason: yearData?.reason,
          }),
        }
      );

      const data = await response.text();
      console.log(data);
      if (getFunction) {
        getFunction();
      }
      setOpenModal(false);
      setToast({
        message: data,
        type: "dark",
        visible: true,
      });
    } catch (err) {
      console.log(err);
      setToast({
        message: "Something Went Wrong",
        type: "error",
        visible: true,
      });
    }
  };

  return (
    <>
    <Modal
      close={setOpenModal}
      footer={false}
      title={
        openModal?.pause_status == "no" || !openModal?.pause_status ? "Pause Student" : "Resume Student"
      }
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>
          {openModal?.pause_status == "no" || !openModal?.pause_status ? "Pause Student" : "Resume Student"}
        </h3>
        <p className="warning-message">
          Are you sure you want to{" "}
          {openModal?.pause_status == "no" || !openModal?.pause_status ? "Pause" : "Resume"} this Student?
          This action will update the status of the student.
        </p>
        <div className="year-details">
          <strong>Name:</strong> {openModal?.student_name}
        </div>
        {openModal?.pause_status == "no" || !openModal?.pause_status ? (
          <div className="form-group">
            <label htmlFor="">Reason</label>
            <textarea
              cols="30"
              rows="10"
              onChange={(e) => {
                setYearData({
                  ...yearData,
                  reason: e.target.value,
                });
              }}
            ></textarea>
          </div>
        ) : null}
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
                {openModal?.pause_status == "no" || !openModal?.pause_status ? "Pause" : "Resume"}
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
        
      </div>
    </Modal>
    {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(false)}
          />
        )}
    </>
  );
}

export default PauseStudent;
