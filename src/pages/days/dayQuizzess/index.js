import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  questions,
  score
} from "../../../assets/svgIcons";
import AddQuiz from "../../../components/days/exams/add";
import DeleteQuiz from "../../../components/days/exams/delete";
import EditQuiz from "../../../components/days/exams/edit";
import ShowHideQuiz from "../../../components/days/exams/showHide";
import CustomTable from "../../../components/table";
import "./style.css";

const DaysQuiz = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [initialQuizData, setInitialQuizData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState([]);
  const navigate = useNavigate();
  const { pack, group, lecture, day } = useParams();

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
              onClick={() => navigate(`${row?.lec_id}`)}
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

  const getQuestions = async (questionIndex) => {
    setIsPageLoading(true);

    let dataToSend = {
      id: day, 
    };

    try {
      const response = await fetch(
        "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/select_questions_lec.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const resData = await response.json();
      console.log(resData);

      if (response.status === 200 && resData !== "error") {
        if (resData.questions && resData.questions.length > 0) {
          const updatedDeleteLoading = Array(resData.questions.length).fill(false);
          setQuestions(resData.questions);
          setDeleteLoading(updatedDeleteLoading);
          if (Number.isInteger(questionIndex)) {
            scrollToIndex(questionIndex);
          }
        } else {
          console.log("No questions found");
        }
      } else {
        console.error("An error occurred");
      }
    } catch (err) {
      console.error("An error occurred", err);
    } finally {
      setIsPageLoading(false);
    }
  };

  const scrollToIndex = (index) => {
    
  };

  useEffect(() => {
    getQuestions(0); 
  }, [day]); 

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
      <CustomTable dataSource={initialQuizData} columns={columns} />
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
};

export default DaysQuiz;
