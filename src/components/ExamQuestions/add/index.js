import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa"; 
import "./style.css";

function AddQuestion({ getFunction, openModal, setOpenModal }) {
  const [questionData, setQuestionData] = useState({
    name: "",
    image: null,
    answers: [{ text: "", isCorrect: false }],
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [...questionData.answers, { text: "", isCorrect: false }],
    });
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = questionData.answers.filter((_, i) => i !== index);
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = questionData.answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const handleImageChange = (e) => {
    setQuestionData({ ...questionData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setQuestionData({ ...questionData, image: null });
  };

  const handleLabelClick = (index) => {
    const updatedAnswers = questionData.answers.map((answer, i) =>
      i === index ? { ...answer, isCorrect: true } : { ...answer, isCorrect: false }
    );
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const saveNewQuestion = (e) => {
    e.preventDefault();
    if (!questionData?.loading) {
      setQuestionData({ ...questionData, loading: true });
      setToast(true);
      const formData = new FormData();
      formData.append("name", questionData.name);
      formData.append("image", questionData.image);
      formData.append("answers", JSON.stringify(questionData.answers));

      axios
        .post("/api/questions", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          
          getFunction();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setQuestionData({ ...questionData, loading: false });
        });
    }
  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Add Question"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewQuestion(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionName" className="form-label">
            Question Name
          </label>
          <input
            type="text"
            id="questionName"
            placeholder="Enter Question Name"
            onChange={(e) => setQuestionData({ ...questionData, name: e.target.value })}
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
          {questionData.image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(questionData.image)} alt="Question Preview" />
              <button type="button" onClick={removeImage} className="remove-image-btn">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        {questionData.answers.map((answer, index) => (
          <div key={index} className="answer-row">
            <input
              type="text"
              placeholder="Enter Answer Text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
              className="answer-input"
            />
            <input
              type="checkbox"
              checked={answer.isCorrect}
              onChange={() => handleLabelClick(index)}
              className="answer-checkbox"
              readOnly
            />
            <label onClick={() => handleLabelClick(index)}>Correct Answer</label>
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
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default AddQuestion;
