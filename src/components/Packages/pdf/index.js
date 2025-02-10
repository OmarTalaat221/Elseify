import React, { useState } from "react";
import Modal from "../../modal";
import {
  addNew,
  deleteIcon,
  editIcon,
  pdfIcon,
} from "../../../assets/svgIcons";
import "./style.css";
import DeletePdf from "./deletePDf";
import EditPdf from "./editVideo";
function PdfOpen({ openModal, setOpenModal, getFunction }) {
  const [openDelete, setOpenDelete] = useState(null);
  const [openEdit, setOpenEdit] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  return (
    <>
      <Modal
        close={() => setOpenModal(false)}
        footer={false}
        title={"PDF"}
        visible={openModal}
      >
        {openModal?.attach_pdf && openModal?.attach_pdf?.length ? (
          <div className="pdfView">
            <span>{pdfIcon}</span>
            <a href={openModal?.attach_pdf} target="_blanck">
              Attachment
            </a>

            <pre>
              <p onClick={() => setOpenDelete(openModal)}>{deleteIcon}</p>
              {/* <p
              onClick={() => {
                setOpenEdit(openModal);
                setIsEdit(true);
              }}
            >
              {editIcon}
            </p> */}
            </pre>
          </div>
        ) : null}
        <p
          className="createnew"
          onClick={() => {
            setOpenEdit(openModal);
            setIsEdit(false);
          }}
        >
          <span>{addNew}</span> <span>Add / Edit PDF</span>
        </p>
      </Modal>
      <EditPdf
        getFunction={getFunction}
        openModal={openEdit}
        setOpenModal={setOpenEdit}
        edit={isEdit}
      />{" "}
      <DeletePdf
        getFunction={getFunction}
        openModal={openDelete}
        setOpenModal={setOpenDelete}
      />
    </>
  );
}

export default PdfOpen;
