import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";

function DeleteLecture({ getFunction, openModal, setOpenModal }) {
  const [lectureData, setLectureData] = useState({
    title: openModal?.name,
    description: openModal?.description,
    image: openModal?.image,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const deleteLecture = (e) => {
    e.preventDefault();
    if (!lectureData?.loading) {
      setLectureData({ ...lectureData, loading: true });
      setToast(true);
      axios
        .delete(`your-api-endpoint/${openModal?.id}`) 
        .then((res) => {
          getFunction(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to delete lecture:", err);
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
        image: openModal.image,
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Lecture"}
      visible={!!openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this lecture?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following lecture:
        </p>
        <div className="lecture-details">
          <strong>Title:</strong> {lectureData?.title}
        </div>
        <div className="lecture-details">
          <strong>Description:</strong> {lectureData?.description}
        </div>
        {lectureData?.image && (
          <div className="lecture-image">
            <img src={lectureData?.image} alt="Lecture" />
          </div>
        )}
        <div className="rowEndDiv">
          {lectureData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteLecture}
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
          <Toast message={"An error occurred. Please try again."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
    </Modal>
  );
}

export default DeleteLecture;
