import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus } from "react-icons/fa";
import "./style.css";
import { useParams } from "react-router-dom";
import { secondUrl } from "../../../utils/baseUrl";

function AddDay({ getFunction, openModal, setOpenModal }) {
  const [dayData, setDayData] = useState({
    day_name: "",
    day_description: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const { pack, group, lecture } = useParams();

  const saveNewDay = async (e) => {
    e.preventDefault();

    const { day_name, day_description } = dayData;

    if (day_name.trim() === "") {
      alert("يجب إدخال اسم اليوم .");
      return;
    }

    setDayData({ ...dayData, loading: true });

    const formDataObj = new FormData();
    formDataObj.append("lec_title", day_name);
    formDataObj.append("lec_description", day_description);
    formDataObj.append("package_id", pack);
    formDataObj.append("group_id", group);
    formDataObj.append("lecture_price", "120");
    formDataObj.append("lec_sub_id", lecture);
    formDataObj.append(
      "lec_arrangement ",
      dayData.lec_arrangement ? dayData.lec_arrangement : 0
    );

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      formDataObj.append("user_id", userData?.user_id);
      const response = await fetch(secondUrl+"add_leceture.php", {
        method: "POST",
        body: JSON.stringify({
          lec_title: day_name,
          lec_description: day_description,
          package_id: pack,
          group_id: group,
          lecture_price: "120",
          lec_sub_id: lecture,
          lec_arrangement: dayData.lec_arrangement ? dayData.lec_arrangement : 0
        }),
      });

      const data = await response.text();
      setDayData({ ...dayData, loading: false });
console.log(data)
      if (data.trim() == '"success"') {
        setToast(true);
        setOpenModal(false);
        getFunction();
        alert("تمت إضافة اليوم بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setDayData({ ...dayData, loading: false });
    }
  };

  return (
    <>
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Add Day"}
      visible={openModal}
    >
      <form onSubmit={saveNewDay} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            Day Name
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="Enter Day Name"
            value={dayData.day_name}
            onChange={(e) =>
              setDayData({ ...dayData, day_name: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            Day Number
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="Enter Day Number"
            value={dayData.lec_arrangement}
            onChange={(e) =>
              setDayData({ ...dayData, lec_arrangement: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayDescription" className="form-label">
            Day Description
          </label>
          <input
            type="text"
            id="dayDescription"
            placeholder="Enter Day Description"
            value={dayData.day_description}
            onChange={(e) =>
              setDayData({ ...dayData, day_description: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-footer">
          {dayData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        
      </form>
    </Modal>
   <>{toast && (
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(false)}
      />
    )}</> 
    </>
  );
}

export default AddDay;
