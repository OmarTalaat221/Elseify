import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function EditExams({ getFunction, openModal, setOpenModal }) {
  const [examData, setExamData] = useState({
    name: openModal?.name || "",
    startDate: openModal?.startDate || "",
    endDate: openModal?.endDate || "",
    numberOfQuestions: openModal?.numberOfQuestions || "",
    examPeriod: openModal?.examPeriod || "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const saveExamData = (e) => {
    e.preventDefault();
    if (!examData?.loading) {
      setExamData({ ...examData, loading: true });
      setToast(true);
      axios
        .put(`/api/exams/${openModal?.id}`, examData) 
        .then((res) => {
          
          getFunction(); 
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
      loading: false,
    });
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Exam"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveExamData(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="examName" className="animated-label">
            Exam Name
          </label>
          <input
            type="text"
            id="examName"
            placeholder="Exam Name"
            value={examData?.name}
            onChange={(e) => {
              setExamData({ ...examData, name: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate" className="animated-label">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={examData?.startDate}
            onChange={(e) => {
              setExamData({ ...examData, startDate: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate" className="animated-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={examData?.endDate}
            onChange={(e) => {
              setExamData({ ...examData, endDate: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numQuestions" className="animated-label">
            Number of Questions
          </label>
          <input
            type="number"
            id="numQuestions"
            placeholder="Number of Questions"
            value={examData?.numberOfQuestions}
            onChange={(e) => {
              setExamData({ ...examData, numberOfQuestions: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="examPeriod" className="animated-label">
            Exam Period
          </label>
          <input
            type="text"
            id="examPeriod"
            placeholder="Exam Period"
            value={examData?.examPeriod}
            onChange={(e) => {
              setExamData({ ...examData, examPeriod: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="rowEndDiv">
          {examData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"An error occurred. Please try again."}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default EditExams;
