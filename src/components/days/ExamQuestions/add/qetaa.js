import React, { useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { useParams, useSearchParams } from "react-router-dom";

function AddComprehensive({
  qetaa,
  getFunction,
  openModal,
  setOpenModal,
  videoId,
}) {
  const { day } = useParams();
  const [questionType] = useSearchParams();
  const [compData, setCompData] = useState({
    type: qetaa?.attach_id ? "old" : "new",
    image: null,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleImageChange = (e) => {
    setCompData({ ...compData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setCompData({ ...compData, image: null });
  };

  const saveComprehensive = async (e) => {
    e.preventDefault();

    if (!compData.image) {
      alert("أدمن", "يجب تحميل صورة");
      return;
    }

    setCompData({ ...compData, loading: true });

    const formDataObj = new FormData();
    formDataObj.append("type", compData.type);
    formDataObj.append(
      "for",
      questionType?.get("type") === "lec" ? "lec" : "video"
    );
    formDataObj.append("lec_id", day);
    formDataObj.append("vid_id", day);
    formDataObj.append(
      "attach_id",
      compData.type === "new" ? "0" : qetaa?.attach_id
    );

    if (compData.image) {
      formDataObj.append("image", compData.image);
    }

    const url = `https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/insert_comperhensive.php`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer access-token", 
        },
        body: formDataObj,
      });

      const data = await response.text();
      setCompData({ ...compData, loading: false });

      if (data.trim() !== "error") {
        setToast(true);
        setOpenModal(false);
        getFunction();
        alert("تمت إضافة القطعة بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setCompData({ ...compData, loading: false });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Add Comprehensive"}
      visible={openModal}
    >
      <form onSubmit={saveComprehensive} className="animated-form">
        <div className="form-group">
          <label htmlFor="compType" className="form-label">
            Comprehensive Type
          </label>
          <input
            type="text"
            id="compType"
            value={compData.type}
            onChange={(e) => setCompData({ ...compData, type: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="compImage" className="form-label">
            Comprehensive Image (Optional)
          </label>
          <input
            type="file"
            id="compImage"
            onChange={handleImageChange}
            className="form-input"
          />
          {compData.image && (
            <div className="image-preview">
              <img
                src={compData.image&&URL.createObjectURL(compData.image)}
                alt="Comprehensive Preview"
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
        <div className="form-footer">
          {compData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"Please fill out all required fields"}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default AddComprehensive;
