"use client";
import { useState, useEffect } from 'react';
import { saveQuestion, getQuestionnairesByCourse, saveQuestionnaire, updateCourse, fetchQuestionsreview, fetchSchedule,deleteQuestion } from "../../../lib/actions";
import styles from "../../../ui/dashboard/addCourse/addCourse.module.css";
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AddQuestionPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [questionsData, setQuestionsData] = useState([
    {
      question: '',
      answers: [''],
      correctAnswer: '',
      selectedQuestionnaire: '',
      language: 'English'
    }
  ]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [newQuestionnaireName, setNewQuestionnaireName] = useState('');
  const [showSelectSection, setShowSelectSection] = useState(true);
  const [showAddQuestionnaireSection, setShowAddQuestionnaireSection] = useState(false);
  const [showAddQuestionsSection, setShowAddQuestionsSection] = useState(false);
  const [reviewQuestionnaireSection, setReviewQuestionnaireSection] = useState(false);
  const [showScheduleSection, setShowScheduleSection] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedReviewQuestionnaire, setSelectedReviewQuestionnaire] = useState('');
  const [selectedQuestionnaireChoice, setSelectedQuestionnaireChoice] = useState('');
  const [ScheduledFromDate, setScheduledFromDate] = useState('');
  const [ScheduledFromTime, setScheduledFromTime] = useState('');
  const [ScheduledToDate, setScheduledToDate] = useState('');
  const [ScheduledToTime, setScheduledToTime] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedFromTime, setSelectedFromTime] = useState('12:00');
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedToTime, setSelectedToTime] = useState('12:00');

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
    const fetchQuestionsData = async () => {
      const data = [];
      setQuestions(data);
    };
    fetchQuestionsData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchSelecteQuestData = async () => {
      const Schedule =await fetchSchedule(id);
      if (Schedule!=""){
        setSelectedQuestionnaireChoice(Schedule.Questionnaire);
        const formattedFromDate = formatDate(Schedule.FromDate);
        const formattedToDate = formatDate(Schedule.ToDate);
        setScheduledFromDate(formattedFromDate);
        setScheduledFromTime(Schedule.FromTime);
        setScheduledToDate(formattedToDate);
        setScheduledToTime(Schedule.ToTime);
      }
      else{
        setSelectedQuestionnaireChoice("Yet to Select!");
      }
      
    };
    fetchSelecteQuestData();
  }, []);


  const handleQuestionChange = (e, qIndex, aIndex) => {
    const { value } = e.target;
    const newQuestionsData = [...questionsData];
    if (aIndex !== undefined) {
      newQuestionsData[qIndex].answers[aIndex] = value;
    } else {
      newQuestionsData[qIndex].question = value;
    }
    setQuestionsData(newQuestionsData);
  };

  const handleAddOption = (qIndex) => {
    setQuestionsData((prevData) => {
      const newQuestionsData = [...prevData];
      newQuestionsData[qIndex].answers = [...newQuestionsData[qIndex].answers, ''];
      return newQuestionsData;
    });
  };

  const handleDeleteOption = (qIndex, aIndex) => {
    setQuestionsData((prevData) => {
      const newQuestionsData = [...prevData];
      if (newQuestionsData[qIndex].answers.length > 1) {
        newQuestionsData[qIndex].answers.splice(aIndex, 1);
      }
      return newQuestionsData;
    });
  };

  const handleQuestionnaireChange = (e, qIndex) => {
    const newQuestionsData = [...questionsData];
    newQuestionsData[qIndex].selectedQuestionnaire = e.target.value;
    setQuestionsData(newQuestionsData);
  };

  const handleLanguageChange = (e, qIndex) => {
    const newQuestionsData = [...questionsData];
    newQuestionsData[qIndex].language = e.target.value;
    setQuestionsData(newQuestionsData);
  };

  const handleAddQuestionnaire = async () => {
    try {
      const newQuestionnaire = await saveQuestionnaire(newQuestionnaireName, questionsData[0].language, id);
      setQuestionnaires((prevQuestionnaires) => [...prevQuestionnaires, newQuestionnaire]);
      setQuestionsData((prevData) => {
        const newQuestionsData = [...prevData];
        newQuestionsData.forEach((data) => {
          data.selectedQuestionnaire = newQuestionnaire._id;
        });
        return newQuestionsData;
      });
      setNewQuestionnaireName('');
    } catch (error) {
      console.error("Error adding questionnaire:", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestionsData((prevData) => [
      ...prevData,
      {
        question: '',
        answers: [''],
        correctAnswer: '',
        selectedQuestionnaire: '',
      }
    ]);
  };

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const handleFromTimeChange = (time) => {
    setSelectedFromTime(time);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  const handleToTimeChange = (time) => {
    setSelectedToTime(time);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionsData.every((q) => q.selectedQuestionnaire)) {
      alert("Please select a questionnaire for each question.");
      return;
    }

    try {
      for (const questionData of questionsData) {
        await saveQuestion(questionData.selectedQuestionnaire, questionData);
      }
      router.push('/dashboard/courses');
    } catch (err) {
      console.error("Error saving questions:", err);
    }
  };

  const handleQuestionnaireupdateChange = (e) => {
    setSelectedQuestionnaire(e.target.value);
  };

  const handleSelect = async (e) => {
    e.preventDefault();

    try {
      const updateResult = await updateCourse(id, { questChoice: selectedQuestionnaire , scheduleFromDate: selectedFromDate, scheduleFromTime: selectedFromTime, scheduleToDate: selectedToDate, scheduleToTime: selectedToTime});
      setShowScheduleSection(!showScheduleSection);
      if (updateResult.success) {
       
        // Handle success, show success message or redirect
      } else {
        // Handle failure, show an error message
        console.log(updateResult.message);
      }
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  const handleReviewQuestionnaireChange = async (e) => {
    const selectedQuestionnaireId = e.target.value;

    const data = await fetchQuestionsreview(selectedQuestionnaireId);
    setQuestions(data);

    setSelectedReviewQuestionnaire(selectedQuestionnaireId);
  };

  const filteredQuestions = questions.filter((question) => question.questionnaire === selectedReviewQuestionnaire);

  return (
    <div className={styles.container}>

      <div className={styles.section}>
      <h4>Schedule: {selectedQuestionnaireChoice}&nbsp;&nbsp;&nbsp;{ScheduledFromDate}&nbsp;&nbsp;&nbsp;{ScheduledFromTime}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{ScheduledToDate}&nbsp;&nbsp;&nbsp;{ScheduledToTime}</h4>
       <button className={styles.sectionHeader} onClick={() => setShowScheduleSection(!showScheduleSection)}>
        Schedule Quiz {showScheduleSection ? '▲' : '▼'}
      </button>
      {showScheduleSection && (
        <form onSubmit={handleSelect} className={styles.form}>
          <select
            value={selectedQuestionnaire}
            onChange={(e) => setSelectedQuestionnaire(e.target.value)}
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
          <h3>Open From:</h3>
          <div className={styles.datetimePicker}>
            <DatePicker
              selected={selectedFromDate}
              onChange={handleFromDateChange}
              className={styles.datePicker}
              dateFormat="MMMM d, yyyy"
              required
            />
            <TimePicker
              onChange={handleFromTimeChange}
              value={selectedFromTime}
              className={styles.timePicker}
              format="HH:mm"
              disableClock
              required
            />
          </div>
          <br />
          <h3>Till:</h3>
          <div className={styles.datetimePicker}>
            <DatePicker
              selected={selectedToDate}
              onChange={handleToDateChange}
              className={styles.datePicker}
              dateFormat="MMMM d, yyyy"
              required
            />
            <TimePicker
              onChange={handleToTimeChange}
              value={selectedToTime}
              className={styles.timePicker}
              format="HH:mm"
              disableClock
              required
            />
          </div>
          <button className={styles.button} type="submit">Update Choice</button>
        </form>
      )}
    </div>

      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => setShowAddQuestionnaireSection(!showAddQuestionnaireSection)}>
          Add New Questionnaire {showAddQuestionnaireSection ? '▲' : '▼'}
        </button>
        {showAddQuestionnaireSection && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Enter new questionnaire name"
              value={newQuestionnaireName}
              onChange={(e) => setNewQuestionnaireName(e.target.value)}
              className={styles.inputText}
              required
            />
            <select value={questionsData[0].language} onChange={(e) => handleLanguageChange(e, 0)} className={styles.select}>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
            <button type="button" onClick={handleAddQuestionnaire} className={`${styles.button} ${styles.addQuestionnaireBtn}`}>
              Add Questionnaire
            </button>
          </form>
        )}
      </div>

      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => setShowAddQuestionsSection(!showAddQuestionsSection)}>
          Adding New Questions {showAddQuestionsSection ? '▲' : '▼'}
        </button>
        {showAddQuestionsSection && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {questionsData.map((questionData, qIndex) => (
              <div key={qIndex} className={styles.questionBlock}>
                <select
                  value={questionData.selectedQuestionnaire}
                  onChange={(e) => handleQuestionnaireChange(e, qIndex)}
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
                <input
                  type="text"
                  placeholder="Question"
                  name="question"
                  value={questionData.question}
                  onChange={(e) => handleQuestionChange(e, qIndex)}
                  className={styles.inputText}
                  required
                />
                {questionData.answers.map((answer, aIndex) => (
                  <div key={aIndex}>
                    <input
                      type="text"
                      placeholder={`Option ${aIndex + 1}`}
                      value={answer}
                      onChange={(e) => handleQuestionChange(e, qIndex, aIndex)}
                      className={styles.inputText}
                      required
                    />
                    {questionData.answers.length > 1 && (
                      <button type="button" className={`${styles.button} ${styles.deleteBtn}`} onClick={() => handleDeleteOption(qIndex, aIndex)}>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                {questionData.answers.length < 10 && (
                  <button type="button" onClick={() => handleAddOption(qIndex)} className={`${styles.button} ${styles.addOptionBtn}`}>
                    Add Option
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Enter Correct Answer"
                  name="correctAnswer"
                  value={questionData.correctAnswer}
                  onChange={(e) => {
                    const newQuestionsData = [...questionsData];
                    newQuestionsData[qIndex].correctAnswer = e.target.value;
                    setQuestionsData(newQuestionsData);
                  }}
                  className={styles.inputText}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className={`${styles.button} ${styles.addQuestionBtn}`}>
              + Add Another Question
            </button>&nbsp;&nbsp;&nbsp;
            <button className={styles.button} type="submit">Submit</button>
          </form>
        )}
      </div>

      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => setReviewQuestionnaireSection(!reviewQuestionnaireSection)}>
          Review Questionnaires {reviewQuestionnaireSection ? '▲' : '▼'}
        </button>
        {reviewQuestionnaireSection && (
          <>
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Question</th>
                  <th>Choices</th>
                  <th>Correct Answer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((question, index) => (
                  <tr key={question._id}>
                    <td>{index + 1}</td>
                    <td>{question.question}</td>
                    <td>{question.answers.join(", ")}</td>
                    <td>{question.correctAnswer}</td>
                    <td>
                      <div className={styles.buttons}>
                        <Link href={`/dashboard/quiz/${question._id}`}>
                          <button className={`${styles.button} ${styles.view}`}>
                            Edit
                          </button>
                        </Link>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const response = await deleteQuestion(question._id);
                            if (response.success) {
                              // Reload the questions after successful deletion
                              setQuestions((prevQuestions) =>
                                prevQuestions.filter((q) => q._id !== question._id)
                              );
                            } else {
                              // Handle error
                              console.error(response.message);
                            }
                          }}
                        >
                          <button type="submit" className={`${styles.button} ${styles.delete}`}>
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </>
        )}
      </div>
      <div>
      <div className={styles.detailscontainer}>
        <div className={styles.detailsheading}>
          Questionnaire and Schedule Details
        </div>
        <div className={styles.detailssection}>
          <h4>Questionnaire Selected:</h4>
          <p>{selectedQuestionnaireChoice}</p>
        </div>
        {selectedQuestionnaireChoice !== "Yet to Select!" && (
          <>
            <div className={styles.detailssection}>
              <h4>Schedule From:</h4>
              <p>Date: {ScheduledFromDate}</p>
              <p>Time: {ScheduledFromTime}</p>
            </div>
            <div className={styles.detailssection}>
              <h4>Schedule To:</h4>
              <p>Date: {ScheduledToDate}</p>
              <p>Time: {ScheduledToTime}</p>
            </div>
          </>
        )}
      </div>
      {questionnaires.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Questionnaire</th>
              </tr>
            </thead>
            <tbody>
              {questionnaires.map((questionnaire, index) => (
                <tr key={questionnaire.id}>
                  <td>{index + 1}</td>
                  <td>{questionnaire.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default AddQuestionPage;