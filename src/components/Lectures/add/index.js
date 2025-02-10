import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { useParams } from "react-router-dom";

function AddLecture({ getFunction, openModal, setOpenModal }) {
  const [lectureData, setLectureData] = useState({
    name: "",
    image: null,
    description: "",
    type: "new", // assuming 'new' type for demonstration
    subject_id: 0,
    loading: false,
  });
  const { lecture, pack, year, group } = useParams();
  const [toast, setToast] = useState(false);

  const handleImageChange = (e) => {
    setLectureData({ ...lectureData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setLectureData({ ...lectureData, image: null });
  };

  const saveNewLecture = (e) => {
    e.preventDefault();

    let col_name = lectureData.name.trim();

    if (!col_name && lectureData.type === "new") {
      setToast({ show: true, message: "يجب إدخال إسم المادة" });
      return;
    }

    if (!lectureData?.loading) {
      setLectureData({ ...lectureData, loading: true });

      const formData = new FormData();
      formData.append("subject_name", col_name);
      if (lectureData.image) {
        formData.append("image", lectureData.image, "avatar.png"); // assuming filename
      }
      formData.append("subject_description", lectureData.description || " ");
      formData.append("package_id", pack); // Replace with actual package_id
      formData.append("group_id", group); // Replace with actual group_id
      formData.append("type", lectureData.type);
      formData.append(
        "subject_id",
        lectureData.type === "new" ? "0" : lectureData.subject_id
      );
      formData.append("have_image", lectureData.image ? "1" : "0");
      

      axios
        .post(
          "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/insert_subject.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data !== "error") {
            setToast({
              type: "success",
              show: true,
              message: "تمت الإضافة بنجاح",
            });
            setOpenModal(false);
            getFunction();
            setLectureData({
              name: "",
              image: null,
              description: "",
              type: "new",
              subject_id: 0,
              loading: false,
            });
          } else {
            setToast({
              show: true,
              message: "حدث خطأ ما من فضلك حاول مره اخرى",
            });
          }
        })
        .catch((err) => {
          setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
          console.error(err);
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
            onChange={(e) =>
              setLectureData({ ...lectureData, name: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lecturenumber" className="form-label">
            Lecture Number
          </label>
          <input
            type="text"
            id="lecturenumber"
            placeholder="Enter Lecture number"
            onChange={(e) =>
              setLectureData({
                ...lectureData,
                lec_arrangement: e.target.value,
              })
            }
            className="form-input"
          />
        </div>{" "}
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
              <img
                src={URL.createObjectURL(lectureData.image)}
                alt="Lecture Preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
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
            onChange={(e) =>
              setLectureData({ ...lectureData, description: e.target.value })
            }
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
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default AddLecture;
