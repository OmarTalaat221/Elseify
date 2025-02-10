import React, { useState } from "react";
import Modal from "../../../../modal";
import axios from "axios";
import Toast from "../../../../toast";
import Loader from "../../../../loader";
import "./style.css";
import CustomSelect from "../../../../selectBox";
import { baseUrl } from "../../../../../utils/baseUrl";

function AddScore({ id, getStudents, openModal, setOpenModal, students }) {
  const [scoreData, setScoreData] = useState({
    studentId: "",
    degree: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleStudentChange = (e) => {
    setScoreData({ ...scoreData, studentId: e?.value });
  };

  const handleDegreeChange = (e) => {
    setScoreData({ ...scoreData, degree: e.target.value });
  };

  const saveNewScore = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        baseUrl + "absence/submit_quiz_student_degree.php",
        {
          method: "POST",
          header: { "Content-Type": "Application/Json" },
          body: JSON.stringify({
            quiz_id: id,
            student_id: scoreData?.studentId,
            score: scoreData?.degree,
          }),
        }
      );
      const data = await response.text();
      if (getStudents) {
        getStudents();
      }
      setToast({ type: "dark", message: data });
    } catch (err) {
      setToast({ type: "error", message: "Somethimg went wrong" });
    }
  };

  return (
    <form onSubmit={saveNewScore} className="animated-form score-form">
      <div className="form-group">
        <label htmlFor="studentSelect" className="form-label">
          Select Student
        </label>
        <CustomSelect
          value={{ value: scoreData?.studentId }}
          onChange={handleStudentChange}
          
          options={students?.map((student) => ({
            value: student?.student_id,
            label: student?.student_name,
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
        <Toast message={toast.message} type={toast.type} onClose={setToast} />
      )}
    </form>
  );
}

export default AddScore;
