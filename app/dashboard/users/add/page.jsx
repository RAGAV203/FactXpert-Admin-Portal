"use client";
import { useState } from "react";
import { addStudent, addStudentcsv, exportUsersToCSV } from "../../../lib/actions";
import styles from "../../../ui/dashboard/addCourse/addCourse.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parse } from 'csv-parse';
import Link from "next/link";
import { CSVLink } from 'react-csv';

const AddUserPage = () => {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);

  const handleDownload = async () => {
    try {
      const userdetails = await exportUsersToCSV();
      setUsers(userdetails);
      console.log(users);
    } catch (error) {
      console.error('Error exporting users to CSV:', error);
      // Handle error
    }
  };
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const users = await processCSVFile(file);
        await createUsers(users);
        // Show success message and redirect to dashboard
        toast.success("Users added/updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        // Show error message if file processing fails
        toast.error("Error in file processing. Please try with another CSV file", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        console.error(error);
      }
    } else {
      // Handle case where no file is selected
    }
  };

  const processCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        parse(csvData, { columns: true }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      };
      reader.readAsText(file);
    });
  };

  const createUsers = async (users) => {
    for (const user of users) {
      const { username, age, gender, language, phone, area } = user;
      const password = generateRandomPassword();
      try {
        await addStudentcsv({ username, age, gender, language, phone, password,area });
      } catch (error) {
        console.log(`Failed to create user ${username}: ${error}`);
      }
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  return (
    <div className={styles.container}>
       <div>
      <button onClick={handleDownload} className={styles.button}>Download Users CSV</button>
      {users.length > 0 && (
        <CSVLink data={users} filename="users.csv">
          Download CSV
        </CSVLink>
      )}
    </div>
      <form action={addStudent} className={styles.form}>
      <h2>Add Users Manually</h2>
        <input type="text" placeholder="Username" name="username" className={styles.inputText} required />
        <input type="text" placeholder="Phone Number" name="phone" className={styles.inputText} required />
        <select placeholder="Language" name="language" className={styles.inputText} required>
         <option value="English">English</option>
         <option value="Hindi">Hindi</option>
         </select>
        <input type="number" placeholder="Age" name="age" className={styles.inputText} required />
        <select placeholder="gender" name="gender" className={styles.inputText} required >
         <option value="Male">Male</option>
         <option value="Female">Female</option>
         </select>
        <input type="text" placeholder="Area" name="area" className={styles.inputText} required />
        <input
          type="password"
          placeholder="password"
          name="password"
          className={styles.inputText}
          required
        />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
      
      <form onSubmit={handleFormSubmit} className={styles.form}>
      <h2>Import Users from CSV file</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} className={styles.inputFile} required/>
        <button type="submit" className={styles.button}>Submit</button>
      </form>

      <Link href={`/dashboard/users/`}><button className={styles.button}>Return to Users</button></Link>
      <div>
      {/* Include ToastContainer at the root of your application */}
      <ToastContainer />
      {/* Your component JSX */}
    </div>
   
    </div>
  );
};

export default AddUserPage;
