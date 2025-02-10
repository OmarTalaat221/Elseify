import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import "./style.css";
import CustomSelect from "../../selectBox";

function AddScore({ getStudents, openModal, setOpenModal, students }) {
  const [scoreData, setScoreData] = useState({
    studentId: "",
    degree: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleStudentChange = (e) => {
    setScoreData({ ...scoreData, studentId: e });
  };

  const handleDegreeChange = (e) => {
    setScoreData({ ...scoreData, degree: e.target.value });
  };

  const saveNewScore = (e) => {
    e.preventDefault();
    if (!scoreData?.loading) {
      setScoreData({ ...scoreData, loading: true });
      setToast(true);

      axios
        .post("/api/scores", scoreData)
        .then((res) => {
          getStudents();
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
    <form onSubmit={saveNewScore} className="animated-form score-form">
      <div className="form-group">
        <label htmlFor="studentSelect" className="form-label">
          Select Student
        </label>
        <CustomSelect
          
          onChange={handleStudentChange}
          options={students?.map((student) => ({
            value: student?.key,
            label: student?.name,
          }))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="degreeInput" className="form-label">
          Degree
        </label>
        <input
          type="number"
          id="degreeInput"
          placeholder="Enter Degree"
          value={scoreData.degree}
          onChange={handleDegreeChange}
          className="form-input"
          min="0"
          max="100"
        />
      </div>
      <div className="form-footer">
        {scoreData?.loading ? (
          <Loader />
        ) : (
          <button type="submit" className="form-submit-btn">
            Save
          </button>
        )}
      </div>
      {toast && (
        <Toast
          message={"Please fill out all required fields"}
          type={"error"}
          onClose={setToast}
        />
      )}
    </form>
  );
}

export default AddScore;
