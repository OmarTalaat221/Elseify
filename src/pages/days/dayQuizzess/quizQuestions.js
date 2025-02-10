import React, { useState, useEffect } from "react";
import QuestionCard from "../../../components/ExamQuestions/questionCard/QuestionCard";
import Toast from "../../../components/toast";
import Loader from "../../../components/loader";
import AddQuestion from "../../../components/days/ExamQuestions/add";
import EditQuestion from "../../../components/days/ExamQuestions/edit";
import { useParams, useSearchParams } from "react-router-dom";
import AddComprehensive from "../../../components/days/ExamQuestions/add/qetaa";
import DeleteQuestion from "./delete";
import DeleteComphersive from "./deleteComprehsive";

function QuizQuestions() {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteComModal, setOpenDeleteComModal] = useState(false);
  const [openComprehensiveModal, setOpenComprehensiveModal] = useState(false);
  const { pack, group, lecture, day } = useParams();
  const [type] = useSearchParams();
  const [qetaa, setQetaa] = useState(null);
  const getData = () => {
    fetch(
      type?.get("type") == "lec"
        ? "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/select_questions_lec.php"
        : "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/select_questions_videos.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: day }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (
          data?.questions &&
          data?.questions !== "error" &&
          Array.isArray(data?.questions)
        ) {
          setQuestions(data.questions);
          setQetaa(data.attach);
        } else {
          console.error("Error fetching questions:", data);
          setToast(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setToast(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const handleEditClick = (question) => {
    setCurrentQuestion(question);
    setOpenEditModal(question);
  };

  return (
    <div className="exam-questions">
      <div className="header">
        <h1>Quiz Questions</h1>
        <button className="btn btn-success" onClick={() => setOpenModal(true)}>
          Add Question
        </button>
        {/* Button for Adding or Editing Comprehensive */}
        <button
          className="btn btn-success"
          onClick={() => setOpenComprehensiveModal(true)}
        >
          Add/Edit Comprehensive
        </button>
      </div>

      {qetaa ? (
        <div className="qetaa-display">
          {qetaa.attach_img ? (
            <img src={qetaa.attach_img} alt="Attachment" />
          ) : (
            <p>{qetaa.text}</p>
          )}
          <button
            className="btn btn-danger"
            onClick={() => setOpenDeleteComModal(qetaa.attach_id)}
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="questions-grid">
        {questions.map((question) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            onEdit={() => handleEditClick(question)}
            onDelete={() => {
              setOpenDeleteModal(question);
            }}
          />
        ))}
      </div>

      <AddQuestion
        openModal={openModal}
        setOpenModal={setOpenModal}
        getFunction={() => getData()}
      />
      <DeleteComphersive
        openModal={openDeleteComModal}
        setOpenModal={setOpenDeleteComModal}
        getFunction={() => getData()}
      />
      <DeleteQuestion
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        getFunction={() => getData()}
      />
      {currentQuestion && (
        <EditQuestion
          questionId={currentQuestion.question_id}
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          questionData={currentQuestion}
          getFunction={getData}
        />
      )}

      {/* Comprehensive Add/Edit Modal */}
      <AddComprehensive
        qetaa={qetaa}
        openModal={openComprehensiveModal}
        setOpenModal={setOpenComprehensiveModal}
        getFunction={getData}
      />

      {loading && <Loader />}
      {toast && (
        <Toast
          message={"An error occurred. Please try again."}
          type={"error"}
          onClose={() => setToast(false)}
        />
      )}
    </div>
  );
}

export default QuizQuestions;
