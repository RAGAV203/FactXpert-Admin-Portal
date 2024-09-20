import styles from "./home.module.css";
import Link from "next/link";
import { SiExpertsexchange } from "react-icons/si";

const Homepage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
      <center><h1 className={styles.title}>
      <SiExpertsexchange /></h1>
    </center>
        <h1 className={styles.title}>FactXpert</h1><h2>Admin Portal </h2>

        
        <p className={styles.desc}>
          Welcome <br />Login to Continue
        </p>
       
        <center>
          <div className={styles.newbtn}>
            <Link href={`/login`}>
              <button className={`${styles.btn}`}>Admin Login</button>
            </Link>
          </div> &nbsp;&nbsp;&nbsp;
          <div className={styles.newbtn}>
            <Link href={`https://fact-xpert-quiz-portal.vercel.app/login`}>
              <button className={`${styles.btn}`}>User Login</button>
            </Link>
          </div>
        </center>
      </div>
      
    </div>
  );
};

export default Homepage;
