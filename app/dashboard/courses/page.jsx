"use client";
import { useState, useEffect } from 'react';
import { fetchCourses, deleteCourse } from "../../lib/actions";
import styles from "./course.module.css";
import Link from 'next/link';
const ListCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function getCourses() {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    getCourses();
  }, []);

  const onDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      // Reload the courses after deletion
      const coursesData = await fetchCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };


  return (
    <div>
      <div className={styles.container}>

        <Link href="/dashboard/courses/add">
          <button className={styles.addButton}>Add New Course</button>
        </Link>
      </div>
      <div className={styles.container}>
        <div className={styles.coursesContainer}>
          {courses.map((course) => (
            <div key={course._id} className={styles.courseBox}>
              <h3>{course.name}</h3>
              <p>Language: {course.language}</p>
              <Link href={`/dashboard/courses/${course._id}`}>
                <button className={`${styles.button1} ${styles.view}`}>
                  View/Edit Quiz
                </button>
              </Link>
              &nbsp;&nbsp;&nbsp;
              <button
                onClick={() => onDeleteCourse(course._id)}
                className={`${styles.button3} ${styles.view}`}
              >
                Delete Course
              </button>
              <Link href={`/dashboard/courses/${course._id}/users`}>
                <button className={`${styles.button2} ${styles.view}`}>
                  Add Members
                </button>
              </Link><br />
              <Link href={`/dashboard/results/${course._id}`}>
                <button className={`${styles.button2} ${styles.view}`}>
                  View Results
                </button>
              </Link>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCoursesPage;
