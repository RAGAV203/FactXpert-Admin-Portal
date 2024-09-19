"use client";

import { authenticate, addUser } from "../../../lib/actions";
import styles from "./registerForm.module.css";
import { useFormState } from "react-dom";

const RegisterForm = () => {
  const [state, formAction] = useFormState(authenticate, undefined);

  return (
    <form action={addUser} className={styles.form}>
      <label>Register</label>
      <input type="text" placeholder="username" name="username" required />
        <input type="email" placeholder="email" name="email" required />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
        />
        <input type="phone" placeholder="phone" name="phone" />
        <input name="isAdmin" id="isAdmin" value={false} type="hidden" />
        <input name="isActive" id="isActive" value={true} type="hidden"/>
        <button type="submit">Register</button>
      {state && state}
    </form>
  );
};

export default RegisterForm;
