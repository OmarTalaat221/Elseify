import React, {useEffect, useState} from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import {baseUrl} from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";


function DeleteGroupModal({getFunction, openModal, setOpenModal}) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });
  const [toast, setToast] = useState(false);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "select_all_students.php");

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };


  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Delete a group"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>Are you sure you want to delete this group?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following:
        </p>
        <div className="year-details">
          <strong>Name:</strong> {yearData?.name}
        </div>
        <div className="year-details">
          <strong>Description:</strong> {yearData?.description}
        </div>
        <div className="rowEndDiv">
          {yearData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={()=>""}
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
          <Toast message={"An error occurred. Please try again."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
    </Modal>
  );
}

export default DeleteGroupModal;
