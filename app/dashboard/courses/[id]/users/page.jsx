"use client";
import { useState, useEffect } from 'react';
import { fetchUsersAdd, addUserCourse, fetchUsersAdded, removeUserCourse } from "../../../../lib/actions";
import Pagination from "../../../../ui/dashboard/pagination/pagination";
import Search from "../../../../ui/dashboard/search/search";
import styles from "../../../../ui/dashboard/usersadd/usersadd.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UsersPage = ({ searchParams }) => {
  const [userData, setUserData] = useState({ count: 0, users: [] });
  const [viewMembersSection, setViewMembersSection] = useState(false);
  const [addMembersSection, setAddMembersSection] = useState(false);
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const pathname = usePathname();
  const courseID= pathname.split("/")[3];
  useEffect(() => {
    const fetchData = async () => {
      const { count, users } = await fetchUsersAdd(q, page,courseID);
      setUserData({ count, users });
    };

    fetchData();
  }, [q, page]);
  const [usersAdded, setUsersAdded] = useState([]);
  useEffect(() => {
    async function fetchaddedUsers() {
      try {
        const addeduserData = await fetchUsersAdded(q, page,courseID);
        setUsersAdded(addeduserData);
      } catch (error) {
        console.error("Error fetching users added:", error);
      }
    }

    fetchaddedUsers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => setAddMembersSection(!addMembersSection)}>
        Add Members {addMembersSection ? '▲' : '▼'}
        </button>
        <br></br>
        {addMembersSection && (
          <>
      <div className={styles.top}>
      <Link href="/dashboard/users/add">
          <button className={styles.button}>Add New User</button>
        </Link>
        
        <br></br>
        <Search placeholder="Search for a user..." />
        <br></br>
        </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Mobile No.</td>
            <td>Created At</td>
            <td>Role</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {userData.users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={user.img || "/noavatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  /><br></br>
                  {user.username}
                </div>
              </td>
              <td>{user.phone}</td>
              <td>{user.createdAt?.toString().slice(4, 16)}</td>
              <td>{user.isAdmin ? "Admin" : "Student"}</td>
              <td>
              
                <div className={styles.buttons}>
                  <form action={addUserCourse} className={styles.form}>
                    <input type="hidden" name="userID" value={(user._id)} />
                    <input type="hidden" name="courseID" value={(pathname.split("/")[3])} />
                    <button className={`${styles.button}`}>
                      Add To Course
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={userData.count} />
      </>
    )}
    </div>
    
    <br></br>


    <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => setViewMembersSection(!viewMembersSection)}>
        View Members {viewMembersSection ? '▲' : '▼'}
        </button>
        <br></br>
        {viewMembersSection && (
          <>
    <h2>View Members</h2>
    <div className={styles.table2Container}>
      <table className={styles.table2}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>UserName</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usersAdded.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>
              <div className={styles.buttons}>
              <form action={removeUserCourse} className={styles.form}>
                    <input type="hidden" name="userID" value={(user._id)} />
                    <input type="hidden" name="courseID" value={(pathname.split("/")[3])} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete Member
                    </button>
                  </form>
                  </div>
                  </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </>
    )}
    </div>
    </div>
  );
};

export default UsersPage;
