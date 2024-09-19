"use client";

import { authenticate } from "../../../lib/actions";
import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";

const LoginForm = () => {
  const [state, formAction] = useFormState(authenticate, undefined);

  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.title}>Login</h1>
        <input type="text" placeholder="Username" name="username" className={styles.input} />
        <input type="password" placeholder="Password" name="password" className={styles.input} />
        <button type="submit" className={styles.button}>Login</button>
        {state && <div className={styles.stateMessage}>{state}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
