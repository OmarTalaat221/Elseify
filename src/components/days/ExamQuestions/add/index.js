import React, { useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { useParams, useSearchParams } from "react-router-dom";

function AddQuestion({
  getFunction,
  openModal,
  setOpenModal,
  questionType,
  videoId,
}) {
  const [questionData, setQuestionData] = useState({
    question_text: "",
    question_image: null,
    question_answers: [{ answer_text: "", answer_check: false }],
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      question_answers: [
        ...questionData.question_answers,
        { answer_text: "", answer_check: false },
      ],
    });
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = questionData.question_answers.filter(
      (_, i) => i !== index
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = questionData.question_answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };

  const handleImageChange = (e) => {
    setQuestionData({ ...questionData, question_image: e.target.files[0] });
  };

  const removeImage = () => {
    setQuestionData({ ...questionData, question_image: null });
  };

  const handleLabelClick = (index) => {
    const updatedAnswers = questionData.question_answers.map((answer, i) =>
      i === index
        ? { ...answer, answer_check: true }
        : { ...answer, answer_check: false }
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };
  const { lecture, day } = useParams();
  const [type] = useSearchParams();

  const saveNewQuestion = async (e) => {
    e.preventDefault();

    const obj = questionData;

    if (obj.question_text.trim() === "") {
      alert("يجب إدخال نص للسؤال");
      return;
    }
    if (obj.question_answers.length === 0) {
      alert("يجب إدخال إجابات للسؤال ");
      return;
    }
    if (obj.question_answers.length === 1) {
      alert("يجب إدخال أكثر من إجابه ");
      return;
    }

    setQuestionData({ ...questionData, loading: true });

    let answers = obj.question_answers
      .map((answer) => answer.answer_text)
      .join("//CAMP//");

    const formDataObj = new FormData();
    formDataObj.append("question_text", obj.question_text);
    formDataObj.append("question_image", obj.question_image);
    formDataObj.append("question_video_id", day);
    formDataObj.append("question_answers", answers);
    formDataObj.append(
      "question_valid_answer",
      obj.question_answers.find((answer) => answer.answer_check).answer_text
    );

    if (obj.question_image) {
      formDataObj.append("image", obj.question_image);
    }

    const url =
      type?.get("type") == "lec"
        ? "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/add_question_lecture.php"
        : "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/add_question_videos.php";

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      formDataObj.append("user_id", userData?.user_id);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer access-token",
        },
        body: formDataObj,
      });

      const data = await response.text();
      setQuestionData({ ...questionData, loading: false });

      if (data.trim() === '"success"') {
        setToast(true);
        setOpenModal(false);
        getFunction();
        alert("تمت إضافة السؤال بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setQuestionData({ ...questionData, loading: false });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Add Question"}
      visible={openModal}
    >
      <form onSubmit={saveNewQuestion} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionText" className="form-label">
            Question Text
          </label>
          <input
            type="text"
            id="questionText"
            placeholder="Enter Question Text"
            value={questionData.question_text}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                question_text: e.target.value,
              })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionImage" className="form-label">
            Question Image (Optional)
          </label>
          <input
            type="file"
            id="questionImage"
            onChange={handleImageChange}
            className="form-input"
          />
          {questionData.question_image && (
            <div className="image-preview">
              <img
                src={
                  questionData.question_image &&
                  URL.createObjectURL(questionData.question_image)
                }
                alt="Question Preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        {questionData.question_answers.map((answer, index) => (
          <div key={index} className="answer-row">
            <input
              type="text"
              placeholder="Enter Answer Text"
              value={answer.answer_text}
              onChange={(e) =>
                handleAnswerChange(index, "answer_text", e.target.value)
              }
              className="answer-input"
            />
            <input
              type="checkbox"
              checked={answer.answer_check}
              onChange={() => handleLabelClick(index)}
              className="answer-checkbox"
              readOnly
            />
            <label onClick={() => handleLabelClick(index)}>
              Correct Answer
            </label>
            <button
              type="button"
              onClick={() => handleRemoveAnswer(index)}
              className="answer-action-btn remove-answer-btn"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAnswer}
          className="answer-action-btn add-answer-btn"
        >
          <FaPlus /> <span>Add New Answer</span>
        </button>
        <div className="form-footer">
          {questionData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"Please fill out all required fields"}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default AddQuestion;
