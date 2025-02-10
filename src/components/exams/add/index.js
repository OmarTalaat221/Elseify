import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function AddExam({ getFunction, openModal, setOpenModal }) {
  const [examData, setExamData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    numberOfQuestions: "",
    examPeriod: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const saveNewExam = (e) => {
    e.preventDefault();
    if (!examData?.loading) {
      setExamData({ ...examData, loading: true });
      setToast(true);
      axios
        .post("/api/exams", examData)
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

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Add Exam"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewExam(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="examName" className="animated-label">
            Exam Name
          </label>
          <input
            type="text"
            id="examName"
            placeholder="Enter Exam Name"
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
            onChange={(e) => {
              setExamData({ ...examData, endDate: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfQuestions" className="animated-label">
            Number of Questions
          </label>
          <input
            type="number"
            id="numberOfQuestions"
            placeholder="Enter Number of Questions"
            onChange={(e) => {
              setExamData({ ...examData, numberOfQuestions: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="examPeriod" className="animated-label">
            Exam Period (e.g., 2 hours)
          </label>
          <input
            type="text"
            id="examPeriod"
            placeholder="Enter Exam Period"
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
          <Toast message={"No Data Passed"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default AddExam;
