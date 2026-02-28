import React, {useState} from "react";
import Modal from "../../../components/modal";
import Loader from "../../../components/loader";
import {useParams} from "react-router-dom";
import {secondUrl} from "../../../utils/baseUrl";
import toast from "react-hot-toast";
import axios from "axios";

function DeleteQuestion({questionId, openModal, setOpenModal, getFunction}) {
  const [loading, setLoading] = useState(false);
  const {pack, group, lecture, day} = useParams();

  const handleDelete = async () => {
    const dataToSend = {
      question_id: openModal?.question_id,
    };

    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));

      const response = await axios.post(
        `${secondUrl}delete_question.php`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data == "success") {
        toast.success(data);
        setOpenModal(false);
        getFunction();
      } else {
        // Handle error when deletion fails
        toast.error({
          text: "An error occurred while deleting the question.",
          buttonText: "Retry",
          type: "danger",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error({
        text: "An error occurred while deleting the question.",
        buttonText: "Retry",
        type: "danger",
        duration: 7000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Question"}
      visible={openModal}
    >
      <div className="d-flex flex-column gap-3 ">
        <div className="fs-5 bold">Are You Sure To Delete This Question?</div>
        <div className="d-flex justify-content-end gap-3 align-items-center">
          <button className="btn btn-success" onClick={handleDelete}>
            Confirm
          </button>

          <button
            className="btn btn-danger"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteQuestion;
