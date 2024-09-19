import styles from "../ui/login/login.module.css";
import RegisterForm from "../ui/login/registerForm/registerForm";

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <RegisterForm/>
    </div>
  );
};

export default RegisterPage;
