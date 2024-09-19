"use client";
import { useState, useEffect } from 'react';
import { fetchUserResults } from "../../../lib/actions"; 
import { CSVLink } from 'react-csv';
import styles from "./course.module.css";


const Page = () => {
  
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const users = await fetchUserResults();
        setUsers(users.filter(user => user.status.text === 'Completed'));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }

    fetchInitialData();
  });

    const csvData = Users.map((user, index) => ({
      SNo: index + 1,
      Username: user.username,
      Phone: user.phone,
      Language: user.language,
      Progress: user.Progress,
      Status: user.status.text,
    }));
  
    return (
      <div className={styles.container}>
       

 
        {Users.length > 0 ? (
        <>
        <CSVLink data={csvData} filename={`Course_Completed_Students_Details.csv`}>
            <button className={styles.button}>Download Completed Student Details</button>
          </CSVLink>&nbsp;&nbsp;
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Language</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((user, index) => (
                <tr key={index}>
                  <td>{user.SNo}</td>
                  <td>{user.Username}</td>
                  <td>{user.Phone}</td>
                  <td>{user.Language}</td>
                  <td>{user.Progress}/14</td>
                  <td style={{ color: user.Status === 'Completed' ? 'green' : 'red' }}>{user.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className={styles.message}>No Student completed Yet / Student details unavailable.</p>
      )}
    </div>
  );
};

export default Page;
