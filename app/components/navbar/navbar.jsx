import Image from "next/image";
import { auth, signOut } from "../../auth";
import styles from "./navbar.module.css";
import { MdLogout,  MdLogin } from "react-icons/md";
import Link from "next/link";
import { SiExpertsexchange } from "react-icons/si";

const Navbar = async () => {
  try {
  const { user } = await auth();
  if (user) {
    // Use user data here
    return (
      <div className={styles.container}>
        <div className={styles.title}>Fact<SiExpertsexchange />pert</div>
        <div className={styles.menu}>
          {/* Display user details and logout button only on larger screens */}
          <div className={styles.user}>
            <Image
              className={styles.userImage}
              src={user.img || "/noavatar.png"}
              alt=""
              width="50"
              height="50"
            />
            <div className={styles.userDetail}>
              <span className={styles.username}>{user.username}</span>&nbsp;&nbsp;
              <span className={styles.userTitle}>Admin</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className={styles.logout}>
              <MdLogin />
              Logout
            </button>
          </form>
        </div>
      </div>
    );
  } else {

    return (
      <div className={styles.container}>
        <div className={styles.title}>Fact<SiExpertsexchange />pert</div>
        <div className={styles.menu}>
          <p>Error</p>
            <button className={styles.login}>
              <MdLogout />
              Login
            </button>
        </div>
      </div>
    );
  }
} catch (error) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Fact<SiExpertsexchange />pert</div>
        <div className={styles.menu}>
        <Link href={`/login`}>
            <button className={styles.login}>
              <MdLogout />
              Login
            </button>
            </Link>
        </div>
    </div>
  );
}
  
};

export default Navbar;
