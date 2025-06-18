import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/scss/Pagination.module.scss"

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

const Pagination = ({currentPage, totalPages, pageSize, pageSizeOptions, onPageChange, onPageSizeChange,}: PaginationProps) => {
  const handlePageClick = (page: number) => {
    if (onPageChange) onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.paginationContainer}>
      {/* Middle: Page Buttons */}
      <div className={styles.middleSection}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`${styles.paginationButton} ${currentPage === page ? styles.activeButton : null}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          <ChevronRight size={16} />
        </button>

        {/* Left: Page Size Selector */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className={styles.pageSizeSelector}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>

      {/* Right: Total info */}
      <div className={styles.rightSection}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
