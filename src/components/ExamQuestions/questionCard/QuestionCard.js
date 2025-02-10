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
        <h3 className="question-title">{question.question_text}</h3>
        {question.question_image && (
          <img 
            src={question.question_image} 
            alt={question.question_text} 
            className="question-image" 
          />
        )}
        <div className="answers">
          {question.question_answers.map((answer, index) => (
            <div key={index} className="answer">
              <span className="answer-text">{answer.answer_text}</span>
              <input 
                type="radio" 
                checked={answer.answer_check} 
                readOnly 
                className="answer-radio" 
              />
              <label className="answer-label">Correct</label>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default QuestionCard;
