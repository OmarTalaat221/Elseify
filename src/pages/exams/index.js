import React, {useState} from "react";
import CustomTable from "../../components/table";
import "./style.css";
import AddExams from "../../components/exams/add";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  openPage,
  questions,
  score,
} from "../../assets/svgIcons";
import Toast from "../../components/toast";
import EditExams from "../../components/exams/edit";
import DeleteExams from "../../components/exams/delete";
import ShowHideExams from "../../components/exams/showHide";
import {useNavigate} from "react-router-dom";

function Exams() {
  const initialData = [];
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const columns = [
    {
      key: "name",
      title: "Exam Name",
      dataIndex: "name",
      search: true,
    },
    {
      key: "startDate",
      title: "Start Date",
      dataIndex: "startDate",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "endDate",
      title: "End Date",
      dataIndex: "endDate",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "numberOfQuestions",
      title: "Number of Questions",
      dataIndex: "numberOfQuestions",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "examPeriod",
      title: "Exam Period",
      dataIndex: "examPeriod",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            <div
              className="delete-btn c-pointer text-danger"
              onClick={() => setOpenDeleteModal(row)}
            >
              <div className="tooltip">Delete</div>
              {deleteIcon}
            </div>
            <div
              className="open-btn c-pointer text-primary"
              onClick={() => setOpenEditModal(row)}
            >
              <div className="tooltip">Edit</div>
              {editIcon}
            </div>
            <div
              className={
                row?.hidden
                  ? "showhide-btn c-pointer text-success"
                  : "showhide-btn c-pointer text-danger"
              }
              onClick={() => setOpenShowHideModal(row)}
            >
              <div className="tooltip">{row?.hidden ? "Show" : "Hide"}</div>
              {row?.hidden ? closedEye : openedEye}
            </div>
            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.key}`)}
            >
              <div className="tooltip">Questions</div>
              {questions}
            </div>
            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.key}/score`)}
            >
              <div className="tooltip">Scores</div>
              {score}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="exams">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Exams</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Exam
        </button>
      </div>
      <CustomTable dataSource={initialData} columns={columns} />
      <AddExams openModal={openModal} setOpenModal={setOpenModal} />
      <EditExams openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteExams
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHideExams
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
    </div>
  );
}

export default Exams;
