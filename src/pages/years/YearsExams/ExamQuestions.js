import React, {useState, useEffect} from "react";

import {useParams, useSearchParams} from "react-router-dom";
import QuestionCard from "../../../components/ExamQuestions/questionCard/QuestionCard";
import AddQuestion from "../../../components/ExamQuestions/add";
import DeleteComphersive from "../../days/dayQuizzess/deleteComprehsive";
import DeleteQuestion from "../../days/dayQuizzess/delete";
import EditQuestion from "../../../components/ExamQuestions/edit";
import AddComprehensive from "../../../components/days/ExamQuestions/add/qetaa";
import Loader from "../../../components/loader";
import {Toast} from "bootstrap";
import {secondUrl} from "../../../utils/baseUrl";
import axios from "axios";

function YearsExamsQuestions() {
  const {gen_id, exam_id} = useParams();
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteComModal, setOpenDeleteComModal] = useState(false);
  const [openComprehensiveModal, setOpenComprehensiveModal] = useState(false);
  const {pack, group, lecture, day} = useParams();
  const [type] = useSearchParams();
  const [qetaa, setQetaa] = useState(null);

  const getData = () => {
    axios
      .post(
        `${secondUrl}select_questions.php`,
        {exam_id: exam_id}, // Request body
        {
          headers: {
            "Content-Type": "application/json", // Set headers
          },
        }
      )
      .then((response) => {
        const data = response.data;
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
        exam_id={exam_id}
        openModal={openModal}
        setOpenModal={setOpenModal}
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
          setQuestionData={setCurrentQuestion}
          questionData={currentQuestion}
          getFunction={getData}
        />
      )}

      {/* Comprehensive Add/Edit Modal */}

      {loading && <Loader />}
    </div>
  );
}

export default YearsExamsQuestions;
