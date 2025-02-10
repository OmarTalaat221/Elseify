import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function ShowHideLectures({ openModal, setOpenModal }) {
  const [lectureData, setLectureData] = useState({
    title: openModal?.name,
    description: openModal?.description,
    hidden: openModal?.hidden,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!lectureData?.loading) {
      setLectureData({ ...lectureData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.id}`, {
          hidden: !lectureData.hidden,
        })
        .then((res) => {
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to update lecture visibility:", err);
          setToast(true); 
        })
        .finally(() => {
          setLectureData({ ...lectureData, loading: false });
        });
    }
  };

  useEffect(() => {
    if (openModal) {
      setLectureData({
        title: openModal.name,
        description: openModal.description,
        hidden: openModal.hidden,
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={lectureData.hidden ? "Show Lecture" : "Hide Lecture"}
      visible={!!openModal}
    >
      <div className="showhide-warning">
        <h3>{lectureData.hidden ? "Show Lecture" : "Hide Lecture"}</h3>
        <p className="warning-message">
          Are you sure you want to {lectureData.hidden ? "show" : "hide"} this
          lecture? This action will update the visibility status of the lecture.
        </p>
        <div className="lecture-details">
          <strong>Title:</strong> {lectureData?.title}
        </div>
        <div className="lecture-details">
          <strong>Description:</strong> {lectureData?.description}
        </div>
        <div className="rowEndDiv">
          {lectureData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {lectureData.hidden ? "Show" : "Hide"}
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

export default ShowHideLectures;
