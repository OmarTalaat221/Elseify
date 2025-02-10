import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function ShowHideExams({ openModal, setOpenModal }) {
  const [examData, setExamData] = useState({
    name: openModal?.name || "",
    startDate: openModal?.startDate || "",
    endDate: openModal?.endDate || "",
    numberOfQuestions: openModal?.numberOfQuestions || "",
    examPeriod: openModal?.examPeriod || "",
    hidden: openModal?.hidden || false,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!examData?.loading) {
      setExamData({ ...examData, loading: true });
      axios
        .post(`/api/exams/${openModal?.id}`, {
          hidden: !examData.hidden,
        })
        .then((res) => {
          
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
          setToast(true); 
        })
        .finally(() => {
          setExamData({ ...examData, loading: false });
        });
    }
  };

  useEffect(() => {
    setExamData({
      name: openModal?.name || "",
      startDate: openModal?.startDate || "",
      endDate: openModal?.endDate || "",
      numberOfQuestions: openModal?.numberOfQuestions || "",
      examPeriod: openModal?.examPeriod || "",
      hidden: openModal?.hidden || false,
      loading: false,
    });
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={examData.hidden ? "Show Exam" : "Hide Exam"}
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>{examData.hidden ? "Show Exam" : "Hide Exam"}</h3>
        <p className="warning-message">
          Are you sure you want to {examData.hidden ? "show" : "hide"} this
          exam? This action will update the visibility status of the exam.
        </p>
        <div className="exam-details">
          <strong>Exam Name:</strong> {examData?.name}
        </div>
   
        <div className="rowEndDiv">
          {examData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {examData.hidden ? "Show" : "Hide"}
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

export default ShowHideExams;
