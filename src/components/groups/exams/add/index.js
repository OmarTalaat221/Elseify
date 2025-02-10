import React, { useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";
import { baseUrl } from "../../../../utils/baseUrl";

function AddExam({
  getFunction,
  openModal,
  setOpenModal,
  group_id,
  getData,
  user_id,
}) {
  const [examData, setExamData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    numberOfQuestions: "",
    examPeriod: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const saveNewExam = async (e) => {
    try {
      const response = await fetch(
        baseUrl + "absence/create_offline_quiz.php",
        {
          method: "POST",
          header: { "Content-Type": "Application/Json" },
          body: JSON.stringify({
            group_id: group_id,
            user_id: user_id,
          }),
        }
      );
      const data = await response.text();
      if (getData) {
        getData();
      }
      setToast({ type: "dark", message: data });
    } catch (err) {
      setToast({ type: "error", message: "Somethimg went wrong" });
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
     <p> Confirm To Create Quiz...</p>
      <button className="btn btn-success" onClick={()=>{
        saveNewExam()
      }}>Confirm</button>
    </Modal>
    {toast && (
        <Toast message={toast.message} type={toast.type} onClose={setToast} />
      )}
    </>
  );
}

export default AddExam;
