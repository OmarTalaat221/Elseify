import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
function EditYears({ getFunction, openModal, setOpenModal }) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const saveNewYear = (e) => {
    e.preventDefault();
    if (!yearData?.loading) {
      setYearData({ ...yearData, loading: true });
      setToast(true);
      axios
        .post("")
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setYearData({ ...yearData, loading: false });
        });
    }
  };
  useEffect(() => {
    setYearData({
      name: openModal?.grade,
      description: openModal?.description,
      loading: false,
    });
  }, [openModal]);
  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Edit Year"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewYear(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="year" className="animated-label">
            Enter Degree
          </label>
          <input
            type="text"
            id="year"
            placeholder="Degree"
            value={yearData?.name}
            onChange={(e) => {
              setYearData({ ...yearData, name: e.target.value });
            }}
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year" className="animated-label">
            Enter Description
          </label>
          <textarea
            value={yearData?.description}
            name=""
            id=""
            onChange={(e) => {
              setYearData({ ...yearData, description: e.target.value });
            }}
          ></textarea>
        </div>
        <div className="rowEndDiv">
          {/* <span className="cancel-btn" onClick={() => setOpenModal(false)}>
            {"Cancel"}
          </span> */}
          {yearData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"No Data Passed"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default EditYears;
