"use client";
import { useState } from "react";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdPeople,
  MdChecklist,
  MdBrowseGallery,
} from "react-icons/md";


const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdPeople />,
      },
      {
        title: "Courses",
        path: "/dashboard/courses",
        icon: <MdChecklist />,
      },
       {
        title: "Progress Tracker",
        path: "/dashboard/progresstracker",
        icon: <MdBrowseGallery />,
      },
    ],
  },
];

const Sidebar =  () => {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <div className={isOpen ? `${styles.bar} ${styles.bar1}` : styles.bar}></div>
        <div className={isOpen ? `${styles.bar} ${styles.bar2}` : styles.bar}></div>
        <div className={isOpen ? `${styles.bar} ${styles.bar3}` : styles.bar}></div>
      </div>
      <div className={`${styles.container} ${isOpen ? styles.visible : ""}`}>
        <div className={styles.user}>
          
          <div className={styles.userDetail}>
            <span className={styles.userTitle}>Admin</span>
          </div>
        </div>
        <ul className={styles.list}>
          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className={styles.cat}>{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} onClick={toggleSidebar}/>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
