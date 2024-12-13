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
  const [isVerified, setIsVerified] = useState(false); // State to track course verification status

  useEffect(() => {
    // Fetch course details and questions for the specific course
    const fetchCourseData = async () => {
      try {
        // Fetch course verification status and questions
        const response = await axios.get(`http://localhost:5000/api/verify/${course}`);
        setQuestions(response.data.questions); // Assume backend returns questions for the course
        
        // Check if the course is verified
        const courseDetails = response.data.courseDetails; // Assume backend returns course verification status
        setIsVerified(courseDetails.isVerified);

        setAnswers(new Array(response.data.questions.length).fill(null)); // Initialize empty answers
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setLoading(false);
      }
    };

    fetchCourseData();
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
      // Update the course status to verified if the test is passed
      if (response.data.status === "verified") {
        await axios.post(`http://localhost:5000/api/user/verify-course`, { course });
        setIsVerified(true); // Mark the course as verified
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading test...</p>;
  }

  if (isVerified) {
    return (
      <div className="result-container">
        <h2 className="result-title">Course Verified</h2>
        <p>This course has already been verified.</p>
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
