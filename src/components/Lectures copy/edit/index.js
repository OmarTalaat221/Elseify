import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaTrash } from "react-icons/fa";

function EditLecture({ lectureId, lectureData, openModal, setOpenModal, getFunction }) {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  
  useEffect(() => {
    if (openModal) {
      setFormData({
        name: openModal.name,
        image: null, 
        description: openModal.description,
        loading: false,
      });
    }
  }, [openModal]);

  
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  
  const removeImage = () => {
    if (openModal.image) {
      
      axios
        .delete(`/api/lectures/${lectureId}/image`)
        .then(() => {
          setFormData({ ...formData, image: null });
        })
        .catch((err) => {
          console.error("Failed to delete image:", err);
        });
    } else {
      setFormData({ ...formData, image: null });
    }
  };

  
  const saveUpdatedLecture = (e) => {
    e.preventDefault();
    if (!formData?.loading) {
      setFormData({ ...formData, loading: true });
      setToast(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }
      formDataObj.append("description", formData.description);

      axios
        .put(`/api/lectures/${lectureId}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          getFunction();
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFormData({ ...formData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Lecture"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedLecture} className="animated-form">
        <div className="form-group">
          <label htmlFor="lectureName" className="form-label">
            Lecture Name
          </label>
          <input
            type="text"
            id="lectureName"
            placeholder="Enter Lecture Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          {openModal?.image && !formData?.image && (
            <div className="image-preview">
              <img src={openModal.image} alt="Lecture" />
              <button type="button" onClick={removeImage} className="remove-image-btn">
                <FaTrash />
              </button>
            </div>
          )}
          {formData.image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.image)} alt="Lecture Preview" />
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            rows="4"
          />
        </div>
        <div className="form-footer">
          {formData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={() => setToast(false)} />
        )}
      </form>
    </Modal>
  );
}

export default EditLecture;
