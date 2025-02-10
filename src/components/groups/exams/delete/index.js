import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function DeleteExams({ getFunction, openModal, setOpenModal }) {
  const [examData, setExamData] = useState({
    name: openModal?.name,
    startDate: openModal?.startDate,
    endDate: openModal?.endDate,
    numberOfQuestions: openModal?.numberOfQuestions,
    examPeriod: openModal?.examPeriod,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const deleteExam = (e) => {
    e.preventDefault();
    if (!examData?.loading) {
      setExamData({ ...examData, loading: true });
      setToast(true);
      axios
        .delete(`/api/exams/${openModal?.id}`) 
        .then((res) => {
          
          getFunction(); 
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setExamData({ ...examData, loading: false });
        });
    }
  };

  useEffect(() => {
    setExamData({
      name: openModal?.name,
      startDate: openModal?.startDate,
      endDate: openModal?.endDate,
      numberOfQuestions: openModal?.numberOfQuestions,
      examPeriod: openModal?.examPeriod,
      loading: false,
    });
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Exam"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this exam?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following:
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
                className="btn btn-danger"
                onClick={deleteExam}
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

export default DeleteExams;
