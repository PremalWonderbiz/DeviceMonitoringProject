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
    }else {
    setIsHighlighted(false);
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

function areEqual(prevProps: any, nextProps: any) {
  const wasHighlighted = prevProps.highlightedPaths.includes(prevProps.fullPath);
  const isHighlighted = nextProps.highlightedPaths.includes(nextProps.fullPath);

  const valueChanged = prevProps.value !== nextProps.value;

  return !valueChanged && wasHighlighted === isHighlighted;
}


export default React.memo(KeyValueField, areEqual);
