"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import {
  MdLayers
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const currentPath = pathname === "/" ? "Home" : (pathname.split("/")[2] || "Dashboard");

  return (
    <div className={styles.container}>
      
      <div className={styles.title}><MdLayers />&nbsp;{currentPath}</div>
    </div>
  );
};

export default Navbar;
