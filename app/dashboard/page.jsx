"use client";
import { useState, useEffect } from 'react';
import { fetchCount } from "../lib/actions";
import Link from 'next/link';
import styles from "../ui/dashboard/dashboard.module.css";
import { SiExpertsexchange } from "react-icons/si";

const Dashboard = () => {
  const [counts, setCounts] = useState({ CourseCount: 0, StudentCount: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [displayedCounts, setDisplayedCounts] = useState({ CourseCount: 0, StudentCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { CourseCount, StudentCount } = await fetchCount();
        setCounts({ CourseCount, StudentCount });
        if (!animationStarted) {
          animateCounts({ CourseCount, StudentCount });
          setAnimationStarted(true);
        }
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchData();

    // Refresh the counts every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [animationStarted]); // Only re-run effect if animationStarted changes

  // Function to animate the counts
  const animateCounts = ({ CourseCount, StudentCount }) => {
    let animationStartTime = null;
    const duration = 2000; // Animation duration in milliseconds

    const startAnimation = (timestamp) => {
      if (!animationStartTime) animationStartTime = timestamp;
      const progress = timestamp - animationStartTime;
      const percentage = Math.min(progress / duration, 1); // Ensure progress is between 0 and 1
      const animatedCourseCount = Math.round(percentage * CourseCount);
      const animatedStudentCount = Math.round(percentage * StudentCount);
      setDisplayedCounts({ CourseCount: animatedCourseCount, StudentCount: animatedStudentCount });

      if (progress < duration) {
        requestAnimationFrame(startAnimation);
      }
    };

    requestAnimationFrame(startAnimation);
  };



  return (
    <div className={styles.container2}>
       <WelcomeMessage />
      <div className={styles.count}>
        <div className={styles.card}>
        <Link href="/dashboard/courses/">
        <div className={styles.courses}>
          <h2>Courses</h2>
          <p>{displayedCounts.CourseCount}</p>
        </div>
        </Link>
        </div>
      
        <div className={styles.card}>
        <Link href="/dashboard/users/">
        <div className={styles.students}>
          <h2>Users Enrolled</h2>
          <p>{displayedCounts.StudentCount}</p>
        </div>
        </Link>
      </div>
      </div>

      <Instructions />
      <UserManagement />
      <CourseManagement />
    </div>
  );
};

const WelcomeMessage = () => (
  <div className={styles.welcome}>
    <h1><b>Welcome to the Fact<SiExpertsexchange />pert</b></h1>
    <p>Manage users, courses, quizzes, and view results.</p>
  </div>
);

const Instructions = () => (
  <div className={styles.instructions}>
    <h2><b>Instructions</b></h2>
    <ul>
      <li>Use the sidebar to navigate through different features.</li>
    </ul>
  </div>
);

const UserManagement = () => (
  <div className={styles.instructions}>
    <h2><b>User Management</b></h2>
    <ul>
      <li>Create, edit, and delete users.</li>
      <li>Bulk upload users (with 2 columns - username,email) and download user details.</li>
    </ul>
  </div>
);

const CourseManagement = () => (
  <div className={styles.instructions}>
    <h2><b>Course Management</b></h2>
    <ul>
      <li>Edit course details and questionnaires.</li>
      <li>Schedule quizzes with view/edit functionality.</li>
      <li>Add members/students to courses.</li>
      <li>View results for quizzes.</li>
    </ul>
  </div>
);
export default Dashboard;
