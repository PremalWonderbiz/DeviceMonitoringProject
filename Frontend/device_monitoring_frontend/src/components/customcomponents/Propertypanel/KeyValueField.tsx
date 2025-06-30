// components/KeyValueField.tsx
import React, { useEffect, useState } from "react";
import styles from "@/styles/scss/PropertyPanel.module.scss";

const KeyValueField = ({
  keyName,
  value,
  depth,
  fullPath,
  highlightedPaths,
}: {
  keyName: string;
  value: any;
  depth: number;
  fullPath: string;
  highlightedPaths: string[];
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const isPathHighlighted = highlightedPaths.includes(fullPath);

    if (isPathHighlighted) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPaths, fullPath]);


  if (typeof value === "boolean") value = value ? "Yes" : "No";

  return (
    <div className={`${styles.kvRow} ${isHighlighted ? styles.highlight : ""}`}>
      <span className={`${styles.kvKey} ${styles[`depth-${depth}`]}`}>{keyName}</span>
      <span className={styles.kvValue}>{value}</span>
    </div>
  );
};

export default KeyValueField;
