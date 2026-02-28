import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { secondUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function EditQuestion({
  questionId,
  questionData,
  openModal,
  setQuestionData,
  setOpenModal,
  getFunction,
}) {
  useEffect(() => {
    console.log(questionData);
  }, [questionData]);
  const handleImageChange = (e) => {
    setQuestionData({ ...questionData, question_image: e.target.files[0] });
  };

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
    const updatedAnswers = questionData.question_answers?.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };

  const handleLabelClick = (index) => {
    const updatedAnswers = questionData.question_answers?.map((answer, i) =>
      i === index
        ? { ...answer, answer_check: true }
        : { ...answer, answer_check: false }
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };

  const saveUpdatedQuestion = (e) => {
    e.preventDefault();

    if (!questionData.question_text?.trim()) {
      toast.error("Question name cannot be empty.");
      return;
    }

    if (questionData.question_answers.length === 0) {
      toast.error("At least one answer must be provided.");
      return;
    }

    const hasEmptyAnswer = questionData.question_answers.some(
      (answer) => !answer.answer_text?.trim()
    );
    if (hasEmptyAnswer) {
      toast.error("All answers must have text.");
      return;
    }

    const correctAnswers = questionData.question_answers.filter(
      (answer) => answer.answer_check === true
    );
    if (correctAnswers.length !== 1) {
      toast.error("Exactly one correct answer must be selected.");
      return;
    }

    // Proceed if validation passes
    if (!questionData?.loading) {
      const formDataObj = new FormData();

      formDataObj.append("question_text", questionData.question_text);
      formDataObj.append("question_id", questionId);

      formDataObj.append("question_image", questionData.question_image ? 1 : 0);

      if (questionData.question_image) {
        formDataObj.append("image", questionData.question_image);
      }

      const joinedAnswers = questionData.question_answers
        .map((answer) => answer.answer_text)
        .join("//CAMP//");
      formDataObj.append("question_answers", joinedAnswers);

      // Find the correct answer (where answer_check is true)
      const correctAnswer = questionData.question_answers.find(
        (answer) => answer.answer_check === true
      );
      if (correctAnswer) {
        formDataObj.append("question_valid_answer", correctAnswer.answer_text);
      }

      setQuestionData({ ...questionData, loading: true });

      // Send the request
      axios
        .post(`${secondUrl}edit_ques.php`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data === "success") {
            toast.success(res.data);
            getFunction();
            setOpenModal(false);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update the question. Please try again.");
        })
        .finally(() => {
          setQuestionData({ ...questionData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Question"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedQuestion} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionName" className="form-label">
            Question Name
          </label>
          <input
            type="text"
            id="questionName"
            placeholder="Enter Question Name"
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
          {questionData?.question_image && (
            <div className="image-preview">
              <img
                src={
                  questionData?.question_image instanceof File
                    ? URL.createObjectURL(questionData?.question_image)
                    : questionData?.question_image
                }
                alt="Question Preview"
              />
              <button
                type="button"
                onClick={() =>
                  setQuestionData({ ...questionData, question_image: null })
                }
                className="remove-image-btn"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        {questionData?.question_answers?.map((answer, index) => (
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
              className="answer-action-btn remove-answer-btn text-danger"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAnswer}
          className="answer-action-btn add-answer-btn answer-action-btn2"
        >
          <FaPlus /> <span>Add New Answer</span>
        </button>
        <div className="form-footer">
          {questionData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default EditQuestion;
