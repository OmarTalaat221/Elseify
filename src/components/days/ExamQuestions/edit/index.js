import React, { useState, useEffect } from "react";
import Modal from "../../../modal";
import axios from "axios";
import Toast from "../../../toast";
import Loader from "../../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { useParams, useSearchParams } from "react-router-dom";

function EditQuestion({
  questionId,
  questionData,
  openModal,
  setOpenModal,
  getFunction,
}) {
  const [formData, setFormData] = useState({
    question_text: "",
    question_image: null,
    question_answers: [{ answer_text: "", answer_check: false }],
    loading: false,
  });
  const [type] = useSearchParams();

  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (openModal && questionData) {
      setFormData({
        question_text: questionData.question_text,
        question_image: questionData?.question_image,
        question_answers: questionData.question_answers,
        loading: false,
      });
    }
  }, [openModal, questionData]);

  const handleImageChange = (e) => {
    setFormData({ ...formData, question_image: e.target.files[0] });
  };

  const removeImage = () => {
    setFormData({ ...formData, question_image: null });
  };

  const handleAddAnswer = () => {
    setFormData({
      ...formData,
      question_answers: [
        ...formData.question_answers,
        { answer_text: "", answer_check: false },
      ],
    });
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = formData.question_answers.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, question_answers: updatedAnswers });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = formData.question_answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setFormData({ ...formData, question_answers: updatedAnswers });
  };

  const handleLabelClick = (index) => {
    const updatedAnswers = formData.question_answers.map((answer, i) =>
      i === index
        ? { ...answer, answer_check: true }
        : { ...answer, answer_check: false }
    );
    setFormData({ ...formData, question_answers: updatedAnswers });
  };
  const { lecture, day } = useParams();

  const editQuestion = async (e) => {
    e.preventDefault();

    const obj = formData;

    if (obj.question_text.trim() === "") {
      alert("أدمن", "يجب إدخال نص للسؤال");
      return;
    }
    if (obj.question_answers.length === 0) {
      alert("أدمن", "يجب إدخال إجابات للسؤال ");
      return;
    }
    if (obj.question_answers.length === 1) {
      alert("أدمن", "يجب إدخال أكثر من إجابه ");
      return;
    }

    setFormData({ ...formData, loading: true });

    let answers = obj.question_answers
      .map((answer) => answer.answer_text)
      .join("//CAMP//");

    if (
      obj.question_text === questionData.question_text &&
      obj.question_image === questionData.question_image &&
      obj.question_answers === answers &&
      obj.question_valid_answer === questionData.question_valid_answer
    ) {
      alert("أدمن", "يجب تغيير بيانات السؤال ");
      setFormData({ ...formData, loading: false });
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("question_id", questionId);
    formDataObj.append("question_text", obj.question_text);
    formDataObj.append("question_image", obj.question_image ? 1 : 0);
    formDataObj.append("question_answers", answers);
    formDataObj.append(
      "question_valid_answer",
      obj.question_answers.find((answer) => answer.answer_check).answer_text
    );
    formDataObj.append("question_video_id", day);

    if (obj.question_image) {
      formDataObj.append("image", obj.question_image);
    }

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      formDataObj.append("user_id", userData?.user_id);
      const response = await fetch(
        type?.get("type") == "lec"
          ? "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/edit_lec_question.php"
          : "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/edit_video_question.php",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer access-token",
          },
          body: formDataObj,
        }
      );

      const data = await response.text();
      setFormData({ ...formData, loading: false });

      if (data.trim() === '"success"') {
        setToast(true);
        setOpenModal(false);
        getFunction();
        alert("تمت تعديل السؤال بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setFormData({ ...formData, loading: false });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Question"}
      visible={openModal}
    >
      <form onSubmit={editQuestion} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionName" className="form-label">
            Question Text
          </label>
          <input
            type="text"
            id="questionName"
            placeholder="Enter Question Text"
            value={formData.question_text}
            onChange={(e) =>
              setFormData({ ...formData, question_text: e.target.value })
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
          {questionData.question_image && !formData.question_image && (
            <div className="image-preview">
              <img src={questionData.question_image} alt="Question" />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                <FaTrash />
              </button>
            </div>
          )}
          {formData.question_image && (
            <div className="image-preview">
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
        {formData.question_answers.map((answer, index) => (
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
              type="radio"
              checked={answer.answer_check}
              onChange={() => handleLabelClick(index)}
              className="answer-radio"
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
          {formData?.loading ? (
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

export default EditQuestion;
