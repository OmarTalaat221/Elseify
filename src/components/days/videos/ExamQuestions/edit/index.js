import React, { useState, useEffect } from "react";
import Modal from "../../../../modal";
import axios from "axios";
import Toast from "../../../../toast";
import Loader from "../../../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";

function EditQuestion({ questionId, questionData, openModal, setOpenModal, getFunction }) {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    answers: [{ text: "", isCorrect: false }],
    loading: false,
  });

  const [toast, setToast] = useState(false);

  
  useEffect(() => {
    if (openModal && questionData) {
      setFormData({
        name: questionData.name,
        image: null, 
        answers: questionData.answers,
        loading: false,
      });
    }
  }, [openModal, questionData]);

  
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  
  const removeImage = () => {
    if (questionData.image) {
      
      axios
        .delete(`/api/questions/${questionId}/image`)
        .then(() => {
          setFormData({ ...formData, image: null });
        })
        .catch((err) => {
          console.error("Failed to delete image:", err);
        });
    } else {
      setFormData({ ...formData, image: null });
    }
  };

  
  const handleAddAnswer = () => {
    setFormData({
      ...formData,
      answers: [...formData.answers, { text: "", isCorrect: false }],
    });
  };

  
  const handleRemoveAnswer = (index) => {
    const updatedAnswers = formData.answers.filter((_, i) => i !== index);
    setFormData({ ...formData, answers: updatedAnswers });
  };

  
  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = formData.answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setFormData({ ...formData, answers: updatedAnswers });
  };

  
  const handleLabelClick = (index) => {
    const updatedAnswers = formData.answers.map((answer, i) =>
      i === index ? { ...answer, isCorrect: true } : { ...answer, isCorrect: false }
    );
    setFormData({ ...formData, answers: updatedAnswers });
  };

  
  const saveUpdatedQuestion = (e) => {
    e.preventDefault();
    if (!formData?.loading) {
      setFormData({ ...formData, loading: true });
      setToast(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }
      formDataObj.append("answers", JSON.stringify(formData.answers));

      axios
        .put(`/api/questions/${questionId}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          getFunction();
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFormData({ ...formData, loading: false });
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          {questionData.image && !formData.image && (
            <div className="image-preview">
              <img src={questionData.image} alt="Question" />
              <button type="button" onClick={removeImage} className="remove-image-btn">
                <FaTrash />
              </button>
            </div>
          )}
          
        </div>
        {formData.answers.map((answer, index) => (
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
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={() => setToast(false)} />
        )}
      </form>
    </Modal>
  );
}

export default EditQuestion;
