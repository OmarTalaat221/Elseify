import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  questions,
  score
} from "../../../../assets/svgIcons";
import AddQuiz from "../../../../components/days/videos/exams/add";
import DeleteQuiz from "../../../../components/days/videos/exams/delete";
import EditQuiz from "../../../../components/days/videos/exams/edit";
import ShowHideQuiz from "../../../../components/days/videos/exams/showHide";
import CustomTable from "../../../../components/table";
import "./style.css";
 
const initialData = [
  {
    key: "1",
    name: "Midterm Quiz",
    startDate: "2024-09-01",
    endDate: "2024-09-15",
    numberOfQuestions: 50,
    quizPeriod: "2 hours",
    hidden: false,
  },
  {
    key: "2",
    name: "Final Quiz",
    startDate: "2024-12-01",
    endDate: "2024-12-15",
    numberOfQuestions: 100,
    quizPeriod: "3 hours",
    hidden: true,
  },
  {
    key: "3",
    name: "Quiz 1",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    numberOfQuestions: 20,
    quizPeriod: "1 hour",
    hidden: false,
  },
  {
    key: "4",
    name: "Midterm Quiz II",
    startDate: "2024-10-20",
    endDate: "2024-11-05",
    numberOfQuestions: 60,
    quizPeriod: "2 hours",
    hidden: false,
  },
  {
    key: "5",
    name: "Final Quiz II",
    startDate: "2024-12-20",
    endDate: "2024-12-30",
    numberOfQuestions: 120,
    quizPeriod: "3 hours",
    hidden: false,
  },
  {
    key: "6",
    name: "Quiz 2",
    startDate: "2024-11-01",
    endDate: "2024-11-10",
    numberOfQuestions: 30,
    quizPeriod: "1 hour",
    hidden: true,
  },
  {
    key: "7",
    name: "Midterm Quiz III",
    startDate: "2024-11-15",
    endDate: "2024-11-30",
    numberOfQuestions: 55,
    quizPeriod: "2 hours",
    hidden: false,
  },
  {
    key: "8",
    name: "Final Quiz III",
    startDate: "2025-01-05",
    endDate: "2025-01-20",
    numberOfQuestions: 110,
    quizPeriod: "3 hours",
    hidden: false,
  },
  {
    key: "9",
    name: "Quiz 3",
    startDate: "2024-12-01",
    endDate: "2024-12-07",
    numberOfQuestions: 25,
    quizPeriod: "1 hour",
    hidden: true,
  },
  {
    key: "10",
    name: "Midterm Quiz IV",
    startDate: "2025-01-10",
    endDate: "2025-01-25",
    numberOfQuestions: 65,
    quizPeriod: "2 hours",
    hidden: false,
  },
];

function VideoQuiz() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const columns = [
    {
      key: "name",
      title: "Quiz Name",
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
      key: "quizPeriod",
      title: "Quiz Period",
      dataIndex: "quizPeriod",
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
    <div className="quiz">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Quiz</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Quiz
        </button>
      </div>
      <CustomTable dataSource={initialData} columns={columns} />
      <AddQuiz openModal={openModal} setOpenModal={setOpenModal} />
      <EditQuiz openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteQuiz
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHideQuiz
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
    </div>
  );
}

export default VideoQuiz;
