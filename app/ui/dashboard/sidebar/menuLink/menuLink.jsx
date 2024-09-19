"use client"

import Link from 'next/link'
import styles from './menuLink.module.css'
import { usePathname } from 'next/navigation'

const MenuLink = ({item, onClick }) => {

  const handleClick = () => {
    if (onClick) {
      onClick(); // Toggle the sidebar
    }
  };

  const pathname = usePathname()

  return (
    <Link href={item.path} onClick={handleClick} className={`${styles.container} ${pathname === item.path && styles.active}`}>
      {item.icon}
      {item.title}
    </Link>
  )
}

export default MenuLink