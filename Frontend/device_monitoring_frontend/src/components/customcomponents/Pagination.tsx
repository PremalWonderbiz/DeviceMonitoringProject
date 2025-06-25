import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/scss/Pagination.module.scss";

const Pagination = ({currentPage, totalPages, pageSize, pageSizeOptions, setCurrentPage, setPageSize,}: any) => {
  const handlePageClick = (page: any) => setCurrentPage(page);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setPageSize(Number(e.target.value));

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(currentPage - 1, 2);
      const right = Math.min(currentPage + 1, totalPages - 1);
      pages.push(1);
      if (left > 2) pages.push("...");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, i) =>
      page === "..." ? (
        <span key={`ellipsis-${i}`} className={styles.ellipsis}>...</span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`${styles.paginationButton} ${
            currentPage === page ? styles.activeButton : ""
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.middleSection}>
        <button onClick={handlePrev} disabled={currentPage === 1} className={styles.paginationButton}>
          <ChevronLeft size={16} />
        </button>

        {renderPageNumbers()}

        <button onClick={handleNext} disabled={currentPage === totalPages} className={styles.paginationButton}>
          <ChevronRight size={16} />
        </button>

        <select value={pageSize} onChange={handlePageSizeChange} className={styles.pageSizeSelector}>
          {pageSizeOptions.map((size: number) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className={styles.rightSection}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
