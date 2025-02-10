import React from "react";
import "./QuestionCard.css"; 

function QuestionCard({ question, onEdit, onDelete }) {
  return (
    <div className="question-card">
      <div className="actions">
        <button onClick={onEdit} className="action-btn edit-btn">Edit</button>
        <button onClick={onDelete} className="action-btn delete-btn">Delete</button>
      </div>
      <div className="question-content">
        <h3 className="question-title">{question.name}</h3>
        {question.image && <img src={question.image} alt={question.name} className="question-image" />}
        <div className="answers">
          {question.answers.map((answer, index) => (
            <div key={index} className="answer">
              <input type="text" value={answer.text} readOnly className="answer-text" />
              <input type="radio" checked={answer.isCorrect} readOnly className="answer-radio" />
              <label className="answer-label">Correct</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
