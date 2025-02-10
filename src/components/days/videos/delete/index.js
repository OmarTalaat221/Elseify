import React, { useEffect, useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";

function DeleteVideo({ getFunction, openModal, setOpenModal }) {
  const [videoData, setVideoData] = useState({
    name: openModal?.name || "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const deleteVideo = (e) => {
    e.preventDefault();
    if (!videoData?.loading) {
      setVideoData({ ...videoData, loading: true });
      axios
        .delete(`/api/videos/${openModal?.id}`) 
        .then((res) => {
          getFunction(); 
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to delete video:", err);
          setToast(true);
        })
        .finally(() => {
          setVideoData({ ...videoData, loading: false });
        });
    }
  };

  useEffect(() => {
    if (openModal) {
      setVideoData({
        name: openModal.name || "",
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Video"}
      visible={!!openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this video?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following video:
        </p>
        <div className="video-details">
          <strong>Video Name:</strong> {videoData?.name}
        </div>
        <div className="rowEndDiv">
          {videoData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteVideo}
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

export default DeleteVideo;
