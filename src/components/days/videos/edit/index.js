import React, { useEffect, useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";

function EditVideo({ getFunction, openModal, setOpenModal }) {
  const [videoData, setVideoData] = useState({
    video_title: openModal?.name || "",
    viemo_id: openModal?.video_player_id
    || "",
    video_description: openModal?.description || "",
    video_image_link: openModal?.image || "",
    loading: false,
  });

  const [toast, setToast] = useState({ show: false, message: "" });

  const saveUpdatedVideo = async (e) => {
    e.preventDefault();

    
    if (videoData.video_title.trim() === "") {
      setToast({ show: true, message: "الرجاء كتابة عنوان للفيديو" });
      return;
    }
    if (videoData.viemo_id.trim() === "") {
      setToast({ show: true, message: "الرجاء كتابة ال ID الخاص بالفيديو" });
      return;
    }

    setVideoData({ ...videoData, loading: true });

    const dataToSend = {
      video_title: videoData.video_title,
      video_description: videoData.video_description,
      viemo_id: videoData.viemo_id,
      video_id: openModal?.key, 
    };

    try {
      const response = await axios.post(
        "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/edit_video_data.php",
        dataToSend
      );

      if (response.status === 200 && response.data === "success") {
        setToast({ show: true, message: "تم التعديل بنجاح" });
        setOpenModal(false); 
        getFunction(); 
      } else {
        setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
      }
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
    } finally {
      setVideoData({ ...videoData, loading: false });
    }
  };

  useEffect(() => {
    setVideoData({
      video_title: openModal?.name || "",
      viemo_id: openModal?.video_player_id || "",
      video_description: openModal?.description || "",
      video_image_link: openModal?.image || "",
      loading: false,
    });
    console.log(openModal)
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Video"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedVideo} className="animated-form">
        <div className="form-group">
          <label htmlFor="videoTitle" className="animated-label">
            Video Title
          </label>
          <input
            type="text"
            id="videoTitle"
            placeholder="Video Title"
            value={videoData.video_title}
            onChange={(e) =>
              setVideoData({ ...videoData, video_title: e.target.value })
            }
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="viemoId" className="animated-label">
            Video ID (Vimeo ID)
          </label>
          <input
            type="text"
            id="viemoId"
            placeholder="Vimeo ID"
            value={videoData.viemo_id}
            onChange={(e) =>
              setVideoData({ ...videoData, viemo_id: e.target.value })
            }
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoDescription" className="animated-label">
            Description
          </label>
          <textarea
            id="videoDescription"
            placeholder="Description"
            value={videoData.video_description}
            onChange={(e) =>
              setVideoData({ ...videoData, video_description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="videoImage" className="animated-label">
            Image URL
          </label>
          <input
            type="text"
            id="videoImage"
            placeholder="Image URL"
            value={videoData.video_image_link}
            onChange={(e) =>
              setVideoData({ ...videoData, video_image_link: e.target.value })
            }
            className="animated-input"
          />
        </div>
        <div className="rowEndDiv">
          {videoData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              Save
            </button>
          )}
        </div>
        {toast.show && (
          <Toast
            message={toast.message}
            type={"error"}
            onClose={() => setToast({ show: false, message: "" })}
          />
        )}
      </form>
    </Modal>
  );
}

export default EditVideo;
