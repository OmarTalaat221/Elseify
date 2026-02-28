import React, { useEffect, useState } from "react";
import Modal from "../../../modal";
import axios from "axios";

import Loader from "../../../loader";
import { baseUrl, secondUrl } from "../../../../utils/baseUrl";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function AddExam({
  getFunction,
  openModal,
  setOpenModal,
  group_id,
  getData,
  user_id,
}) {
  const { gen_id } = useParams();

  const [examData, setExamData] = useState({
    name: "",

    loading: false,
  });

  // const [toast, setToast] = useState(false);

  // const saveNewExam = async (e) => {
  //   try {
  //     const response = await fetch(
  //       baseUrl + "absence/create_offline_quiz.php",
  //       {
  //         method: "POST",
  //         header: {"Content-Type": "Application/Json"},
  //         body: JSON.stringify({
  //           group_id: group_id,
  //           user_id: user_id,
  //         }),
  //       }
  //     );
  //     const data = await response.text();
  //     if (getData) {
  //       getData();
  //     }
  //     setToast({type: "dark", message: data});
  //   } catch (err) {
  //     setToast({type: "error", message: "Somethimg went wrong"});
  //   }
  // };

  const addExam = async () => {
    if (!examData.name) {
      toast.error("Please fill all required fields.");
      return;
    }

    setExamData({ ...examData, loading: true });

    const dataSend = {
      exam_name: examData?.name,
      generation_id: gen_id,
      // exam_time: 1,
    };

    try {
      const res = await axios.post(`${secondUrl}add_exam.php`, dataSend);
      if (res.data == "success") {
        setOpenModal(false);
        setExamData({
          name: "",

          loading: false,
        });
        toast.success("Exam Added Successfully");
        getData();
      }
    } catch (error) {
      console.error("Error adding exam:", error);
      toast.error("Failed to add exam. Please try again.");
    } finally {
      setExamData({ ...examData, loading: false });
    }
  };

  return (
    <>
      <Modal
        close={setOpenModal}
        footer={false}
        title={"Add Quiz"}
        visible={openModal}
      >
        <form className="animated-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="examName" className="form-label">
              Exam Name <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              id="examName"
              placeholder="Enter Exam Name"
              onChange={(e) =>
                setExamData({ ...examData, name: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-footer">
            {examData?.loading ? (
              <Loader />
            ) : (
              <button
                onClick={addExam}
                type="submit"
                className="form-submit-btn"
              >
                Add
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AddExam;
