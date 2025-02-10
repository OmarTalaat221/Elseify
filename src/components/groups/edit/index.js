import React, {useEffect, useState} from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import {baseUrl} from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";


function EditGroupModal({getFunction, openModal, setOpenModal}) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });
  const [toast, setToast] = useState(false);


  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Edit Group"}
      visible={openModal}
    >
      <form className='animated-form'>
        <div className='form-group'>
          <label htmlFor='year' className='animated-label'>
            Group Name
          </label>
          <input
            type="text"
            id="year"
            placeholder="Group Name"
            
            className="animated-input"
          />

        </div>

        <div className='rowEndDiv'>
          {/* <span className="cancel-btn" onClick={() => setOpenModal(false)}>
            {"Cancel"}
          </span> */}
          {yearData?.loading ? (
            <Loader />
          ) : (
            <button type='submit' className='btn animated-btn btn-success'>
              Add
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

export default EditGroupModal;
