"use client";
import { useState, useEffect } from 'react';
import { getQuestionnairesByCourse, fetchResultsbyquiz, fetchSchedule, fetchCourseMembers } from "../../../lib/actions"; 
import { CSVLink } from 'react-csv';
import styles from "./course.module.css";


const Page = ({ params }) => {
  try {
    const { id } = params;
    const [selectedReviewQuestionnaire, setSelectedReviewQuestionnaire] = useState('');
    const [selectedQuestionnaireChoice, setSelectedQuestionnaireChoice] = useState('');
    const [questionnaires, setQuestionnaires] = useState([]);
    const [Results, setResults] = useState([]);
    const [Members, setMembers] = useState([]);

    useEffect(() => {
      async function fetchQuestionnaires() {
        try {
          const questionnairesData = await getQuestionnairesByCourse(id);
          setQuestionnaires(questionnairesData);
        } catch (error) {
          console.error("Error fetching questionnaires:", error);
        }
      }
  
      fetchQuestionnaires();
    }, [id]);
  
    useEffect(() => {
      const fetchSelecteQuestData = async () => {
        const Schedule = await fetchSchedule(id);
        if (Schedule !== "") {
          setSelectedQuestionnaireChoice(Schedule.Questionnaire);
        }
        else{
          setSelectedQuestionnaireChoice("No Questionnaire is Currently Scheduled for this course!");
        }
      };
      fetchSelecteQuestData();
    }, []);

    useEffect(() => {
      const fetchMembers = async () => {
        const members = await fetchCourseMembers(id);
        if (members !== "") {
          setMembers(members);
        }
      };
      fetchMembers();
    }, []);
  
    const handleReviewQuestionnaireChange = async (e) => {
      const selectedQuestionnaireId = e.target.value;
      const data = await fetchResultsbyquiz(selectedQuestionnaireId);
      setResults(data);
      setSelectedReviewQuestionnaire(selectedQuestionnaireId);
    };
  
    const csvData = Results.map((result, index) => ({
      SNo: index + 1,
      Username: result.username,
      Score: result.quizScore,
      CorrectAnswers: result.correctAnswers,
      WrongAnswers: result.wrongAnswers,
      SubmissionTime: new Date(result.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      Attended: 'Yes' // Default to Yes for those in Results
    }));

    // Adding members who did not participate in the selected questionnaire
    Members.forEach(member => {
      const found = Results.some(result => result.userId === member.userId);
      if (!found) {
        // Add them to the results with default values
        csvData.push({
          SNo: csvData.length + 1,
          Username: member.username, // Username as their userID
          Score: 0,
          CorrectAnswers: 'NA',
          WrongAnswers: 'NA',
          SubmissionTime: 'NA',
          Attended: 'No' // Since they did not participate
        });
      }
    });
  
    return (
      <div className={styles.container}>
        Scheduled: {selectedQuestionnaireChoice}
        <select
          value={selectedReviewQuestionnaire}
          onChange={handleReviewQuestionnaireChange}
          className={styles.select}
          required
        >
          <option value="">Select Questionnaire</option>
          {questionnaires.map((questionnaire) => (
            <option key={questionnaire._id} value={questionnaire._id}>
              {questionnaire.title}
            </option>
          ))}
        </select>

        {Results.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Correct Answers</th>
                  <th>Wrong Answers</th>
                  <th>Submission Time</th>
                  <th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((result, index) => (
                  <tr key={index}>
                    <td>{result.SNo}</td>
                    <td>{result.Username}</td>
                    <td>{result.Score}</td>
                    <td>{result.CorrectAnswers}</td>
                    <td>{result.WrongAnswers}</td>
                    <td>{result.SubmissionTime}</td> 
                    <td>{result.Attended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CSVLink data={csvData} filename={`results_${selectedReviewQuestionnaire}.csv`}>
              <button className={styles.button}>Download Results</button>
            </CSVLink>
          </>
        ) : (
          <p className={styles.message}>No results available for the selected questionnaire. Either Not Attempted or not Scheduled</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching Results:", error);
    return <p className={styles.error}>Error fetching Results. Please try again later.</p>;
  }
};

export default Page;
