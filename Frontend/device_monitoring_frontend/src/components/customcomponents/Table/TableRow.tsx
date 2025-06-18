import React from "react";
import styles from "@/styles/scss/Table.module.scss";
import { Row } from "@tanstack/react-table";

type Props = {
  row: Row<any>;
  setIsPropertyPanelOpen: (id: string) => void;
};

const TableRow = React.memo(({ row, setIsPropertyPanelOpen }: Props) => {
  const rowData = row.original;
  
  return (
    <tr className={styles.row} key={rowData.macId || rowData.id} onClick={() => setIsPropertyPanelOpen(rowData.macId)}>
      {row.getVisibleCells().map((cell : any) => (
        <td key={cell.id} className={styles.cell}>
          {cell.getValue()}
        </td>
      ))}
    </tr>
  );
}, areEqual);

// Comparison function for React.memo
function areEqual(prevProps: Props, nextProps: Props) {
  const prevRow = prevProps.row.original;
  const nextRow = nextProps.row.original;

  return (
    prevRow.macId === nextRow.macId &&
    prevRow.status === nextRow.status &&
    prevRow.connectivity === nextRow.connectivity
  );
}

export default TableRow;
