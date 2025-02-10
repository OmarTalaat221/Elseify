import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "../../components/ExamQuestions/questionCard/QuestionCard";
import Toast from "../../components/toast";
import Loader from "../../components/loader";
import AddQuestion from "../../components/ExamQuestions/add";
import EditQuestion from "../../components/ExamQuestions/edit";
import { sampleQuestionData } from "../../data/questions";

function ExamQuestions() {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    setLoading(true);
    axios.get("/api/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setToast(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEditClick = (question) => {
    setCurrentQuestion(question);
    setOpenEditModal(true);
  };

  return (
    <div className="exam-questions">
      <div className="header">
        <h1>Exam Questions</h1>
        <button className="btn btn-success" onClick={() => setOpenModal(true)}>
          Add Question
        </button>
      </div>
      <div className="questions-grid">
        {sampleQuestionData.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={() => handleEditClick(question)}
            onDelete={() => {
              
            }}
          />
        ))}
      </div>
      <AddQuestion openModal={openModal} setOpenModal={setOpenModal} />
      {currentQuestion && (
        <EditQuestion
          questionId={currentQuestion.id}
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          questionData={currentQuestion}
          getFunction={() => {
            
            setLoading(true);
            axios.get("/api/questions")
              .then((response) => {
                setQuestions(response.data);
              })
              .catch((error) => {
                console.error("Error fetching questions:", error);
                setToast(true);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        />
      )}
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

export default ExamQuestions;
