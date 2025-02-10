import React, { useEffect, useState } from "react";
import { secondUrl } from "../../../utils/baseUrl";
import Loader from "../../loader";
import Modal from "../../modal";
import Toast from "../../toast";

function DeletePdf({ getFunction, openModal, setOpenModal }) {
  const [PdfData, setPdfData] = useState({
    ...openModal,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (openModal) {
      setPdfData({
        ...openModal,
        loading: false,
      });
    }
  }, [openModal]);
  const AddEditPdf = async () => {
    let data_to_send = {
      package_id: openModal?.video_id,
    };


    try {
      const response = await fetch(secondUrl + "delete_package_pdf.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.text();
      setToast({
        type: resData,
        message: resData,
      });
      getFunction()
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <>
      <Modal
        close={() => setOpenModal(false)}
        footer={false}
        title={"Delete Pdf"}
        visible={!!openModal}
      >
        <div className="delete-warning">
          <h3>Are you sure you want to delete this Pdf?</h3>
          <p className="warning-message">
            This action cannot be undone. Please confirm that you want to delete
            the Pdf.
          </p>
          {/* <div className="Pdf-details">
            <strong>Pdf Name:</strong> {PdfData?.name}
          </div> */}
          <div className="rowEndDiv">
            {PdfData?.loading ? (
              <Loader />
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => AddEditPdf()}
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
        </div>
      </Modal>
      {toast && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(false)}
        />
      )}
    </>
  );
}

export default DeletePdf;
