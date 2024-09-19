"use client";
import React from "react";
import styles from "./pagination.module.css";

const Pagination = ({ count, currentPage, onPageChange, perPage }) => {
  const totalPages = Math.ceil(count / perPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.button} ${i === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {generatePageNumbers()}
      <button
        className={`${styles.button} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
