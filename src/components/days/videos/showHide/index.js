import React, { useEffect, useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";

function ShowHideVideo({ openModal, setOpenModal }) {
  const [videoData, setVideoData] = useState({
    name: openModal?.name || "",
    hidden: openModal?.hidden || false,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!videoData?.loading) {
      setVideoData({ ...videoData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.id}`, {
          hidden: !videoData.hidden,
        })
        .then((res) => {
          setOpenModal(false); 
        })
        .catch((err) => {
          console.error("Failed to update video visibility:", err);
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
        hidden: openModal.hidden || false,
        loading: false,
      });
    }
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={videoData.hidden ? "Show Video" : "Hide Video"}
      visible={!!openModal}
    >
      <div className="showhide-warning">
        <h3>{videoData.hidden ? "Show Video" : "Hide Video"}</h3>
        <p className="warning-message">
          Are you sure you want to {videoData.hidden ? "show" : "hide"} this
          video? This action will update the visibility status of the video.
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
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {videoData.hidden ? "Show" : "Hide"}
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

export default ShowHideVideo;
