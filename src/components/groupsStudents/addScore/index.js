import React, { useState, useEffect } from "react";
import Loader from "../../loader";
import Modal from "../../modal";
import Toast from "../../toast";
import { baseUrl } from "../../../utils/baseUrl";

function AddScore({ id, getFunction, openModal, setOpenModal }) {
  const [scoreData, setScoreData] = useState({
    score: "",
    group_id: id,
    student_id: openModal?.student_id,
    loading: false,
  });

  useEffect(() => {
    if (id && openModal) {
      setScoreData({
        score: "",
        group_id: id,
        student_id: openModal?.student_id,
        loading: false,
      });
    }
  }, [id, openModal]);

  const [toast, setToast] = useState(false);

  const saveNewScore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        baseUrl + "3rd_offline_assign/submit_student_degree.php",
        {
          method: "POST",
          headers: { "Content-Type": "Application/Json" },
          body: JSON.stringify(scoreData),
        }
      );

      const data = await response.json();
      console.log(data);
        if (getFunction) {
          getFunction();
        }
        setOpenModal(false);
        setToast({
          message: data,
          type: "dark",
          visible: true,
        });
     
    } catch (err) {
      setToast({
        message: "Something Went Wrong",
        type: "error",
        visible: true,
      });
    }
  };

  return (
    <>
      <Modal
        close={setOpenModal}
        footer={false}
        title={"Add Score"}
        visible={openModal}
      >
        <form onSubmit={(e) => saveNewScore(e)} className="animated-form">
          <div className="form-group">
            <label htmlFor="scoreName" className="animated-label">
              Score
            </label>
            <input
              type="text"
              id="scoreName"
              placeholder="Enter Score Name"
              onChange={(e) => {
                setScoreData({ ...scoreData, score: e.target.value });
              }}
              className="animated-input"
            />
          </div>

          <div className="rowEndDiv">
            {scoreData?.loading ? (
              <Loader />
            ) : (
              <button type="submit" className="btn animated-btn btn-success">
                Save
              </button>
            )}
          </div>
        </form>
      </Modal>
      {toast && (
        <Toast message={toast?.message} type={toast?.type} onClose={setToast} />
      )}
    </>
  );
}

export default AddScore;
