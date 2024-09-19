"use client";
import { useState, useEffect } from "react";
import { updateQuestion, fetchQuestion } from "../../../lib/actions";
import styles from "../../../ui/dashboard/addCourse/addCourse.module.css"
import { useRouter } from 'next/navigation';
//import { redirect } from "next/dist/server/api-utils";


const EditQuestionPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [questionData, setQuestionData] = useState({
    question: '',
    answers: [],
    correctAnswerIndex: '',
    questionnaire: ''
  });

  useEffect(() => {
    async function fetchQuestionData() {
      try {
        const question = await fetchQuestion(id);
        setQuestionData(question);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    }

    fetchQuestionData();
  }, [id]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'answers') {
      const newAnswers = [...questionData.answers];
      newAnswers[index] = value;
      setQuestionData({ ...questionData, answers: newAnswers });
    } else {
      setQuestionData({ ...questionData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuestion(id, questionData);
      router.back();
      
    } catch (err) {
      console.error("Error updating question:", err);
      // Handle error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Question</label>
          <input
            type="text"
            name="question"
            value={questionData.question}
            onChange={handleInputChange}
            className={styles.inputText}
            required
          />
          {questionData.answers.map((answer, index) => (
            <div key={index}>
              <label>{`Answer ${index + 1}`}</label>
              <input
                type="text"
                name="answers"
                value={answer}
                onChange={(e) => handleInputChange(e, index)}
                className={styles.inputText}
                required
              />
            </div>
          ))}
          <label>Correct Answer</label>
          <input
            type="text"
            name="correctAnswer"
            value={questionData.correctAnswer}
            className={styles.inputText}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionPage;
