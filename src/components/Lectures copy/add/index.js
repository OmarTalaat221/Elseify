import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";

function AddLecture({ getFunction, openModal, setOpenModal }) {
  const [lectureData, setLectureData] = useState({
    name: "",
    image: null,
    description: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleImageChange = (e) => {
    setLectureData({ ...lectureData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setLectureData({ ...lectureData, image: null });
  };

  const saveNewLecture = (e) => {
    e.preventDefault();
    if (!lectureData?.loading) {
      setLectureData({ ...lectureData, loading: true });
      setToast(true);
      const formData = new FormData();
      formData.append("name", lectureData.name);
      formData.append("image", lectureData.image);
      formData.append("description", lectureData.description);

      axios
        .post("/api/lectures", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          getFunction();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLectureData({ ...lectureData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Add Lecture"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewLecture(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="lectureName" className="form-label">
            Lecture Name
          </label>
          <input
            type="text"
            id="lectureName"
            placeholder="Enter Lecture Name"
            onChange={(e) => setLectureData({ ...lectureData, name: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lectureImage" className="form-label">
            Lecture Image (Optional)
          </label>
          <input
            type="file"
            id="lectureImage"
            onChange={handleImageChange}
            className="form-input"
          />
          {lectureData.image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(lectureData.image)} alt="Lecture Preview" />
              <button type="button" onClick={removeImage} className="remove-image-btn">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lectureDescription" className="form-label">
            Description
          </label>
          <textarea
            id="lectureDescription"
            placeholder="Enter Lecture Description"
            onChange={(e) => setLectureData({ ...lectureData, description: e.target.value })}
            className="form-input"
            rows="4"
          />
        </div>
        <div className="form-footer">
          {lectureData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default AddLecture;
