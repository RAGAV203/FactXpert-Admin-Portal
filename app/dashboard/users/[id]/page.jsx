import { updateUser } from "../../../lib/actions";
import { fetchUser } from "../../../lib/data";
import styles from "../../../ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";

const SingleUserPage = async ({ params }) => {
  
  const { id } = params;
  const user = await fetchUser(id);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={user.img || "/noavatar.png"} alt="" fill />
        </div>
        {user.username}
      </div>
      <div className={styles.formContainer}>
        <form action={updateUser} className={styles.form}>
          <input type="hidden" name="id" value={user.id}/>
          <label>Username</label>
          <input type="text" name="username" placeholder={user.username} />
          <label>Phone</label>
          <input type="text" name="phone" placeholder={user.phone} />
          <label>Language</label>
        <select placeholder={user.language} name="language" className={styles.inputText}>
         <option value="English">English</option>
         <option value="Hindi">Hindi</option>
         </select>
         <label>Age</label>
        <input type="number" placeholder={user.age} name="age" className={styles.inputText}/>
        <label>Gender</label>
        <select placeholder={user.gender} name="gender" className={styles.inputText} >
         <option value="Male">Male</option>
         <option value="Female">Female</option>
         </select>
         <label>Area</label>
        <input type="text" placeholder={user.area} name="area" className={styles.inputText} />
        <label>Password</label>
        <input
          type="password"
          placeholder="New password"
          name="password"
          className={styles.inputText}
        />
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
