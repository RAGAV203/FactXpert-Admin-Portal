import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>© Developed By Ragav V</div>
      <div className={styles.text}><a href="https://github.com/RAGAV203" target="_blank">RAGAV203</a> | <a href="https://ragav-profile.vercel.app/" target="_blank">Website</a></div>
    </div>
  );
};

export default Footer;
