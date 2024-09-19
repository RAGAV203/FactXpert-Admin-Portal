"use client"
import { useState, useEffect } from 'react';
import { saveCourse, saveQuestionnaire, saveQuestion } from "../../../lib/actions";
import styles from "../../../ui/dashboard/addCourse/addCourse.module.css";


const AddQuestionPage = () => {
  const [newCourseName, setNewCourseName] = useState('');
  const [courseLanguage, setCourseLanguage] = useState('English');
  const [course, setCourse] = useState(null);

  const handleAddCourse = async () => {
    try {
      await saveCourse(newCourseName, courseLanguage);
      
    } catch (error) {
      console.error("Error adding Course:", error);
    }
  };


  return (
    <div className={styles.container}>
      {/* Add Course Form */}
     
      <form onSubmit={handleAddCourse} className={styles.form}>
        <input
          type="text"
          placeholder="Enter new Course name"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          className={styles.inputText}
          required
        />
        <select value={courseLanguage}  className={styles.select} onChange={(e) => setCourseLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
        <button type="submit" className={styles.button}>Add Course</button>
      </form>
     
    </div>
  );
};

export default AddQuestionPage;
