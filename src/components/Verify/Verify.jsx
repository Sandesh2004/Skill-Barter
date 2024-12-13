import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const { course } = useParams(); // Extract the course name from the route
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions for the specific course
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verify/${course}`);
        setQuestions(response.data.questions); // Assume backend returns questions for the course
        setAnswers(new Array(response.data.questions.length).fill(null)); // Initialize empty answers
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [course]);

  const handleAnswerChange = (index, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/verify/${course}/submit`, {
        answers,
      });
      setResult(response.data);
      // Update the course status to verified after successful submission
      if (response.data.status === "verified") {
        await axios.post(`http://localhost:5000/api/user/verify-course`, { course });
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading test...</p>;
  }

  if (result) {
    return (
      <div className="result-container">
        <h2 className="result-title">Test Result</h2>
        <p>Score: {result.score}%</p>
        <p>Status: {result.status}</p>
        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <h2 className="course-title">Course Verification: {course.replace("-", " ")}</h2>
      {questions.map((question, index) => (
        <div className="question-container" key={question.id}>
          <p className="question-text">
            <strong>{index + 1}. {question.question}</strong>
          </p>
          {question.options.map((option, optionIndex) => (
            <label className="option-label" key={optionIndex}>
              <input
                type="radio"
                name={`question-${index}`}
                value={optionIndex}
                checked={answers[index] === optionIndex}
                onChange={() => handleAnswerChange(index, optionIndex)}
                className="option-input"
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit} disabled={answers.includes(null)}>
        Submit
      </button>
    </div>
  );
};

export default Verify;
