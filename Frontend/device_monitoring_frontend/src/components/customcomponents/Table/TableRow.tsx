import React, { useEffect, useState } from "react";
import styles from "@/styles/scss/Table.module.scss";
import { Row } from "@tanstack/react-table";

type Props = {
  row: Row<any>;
  setIsPropertyPanelOpen: (id: string) => void;
  updatedFieldsMap: { [macId: string]: string[] } | null;
  refreshDeviceDataKey: any
};

const TableRow = React.memo(
  ({ refreshDeviceDataKey, updatedFieldsMap, row, setIsPropertyPanelOpen }: Props) => {
    const rowData = row.original;
    const macId = rowData.macId;

    const [localUpdatedFields, setLocalUpdatedFields] = useState<string[]>([]);

    useEffect(() => {
      const updatedFields = updatedFieldsMap?.[macId];
      if (updatedFields && updatedFields.length > 0) {
        setLocalUpdatedFields(updatedFields);

        const timer = setTimeout(() => {
          setLocalUpdatedFields([]);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }, [updatedFieldsMap?.[macId]]);

    useEffect(() => {      
      setLocalUpdatedFields([]);
    }, [refreshDeviceDataKey]);

    return (
      <tr
        className={styles.row}
        key={macId || rowData.id}
        onClick={() => setIsPropertyPanelOpen(macId)}
      >
        {row.getVisibleCells().map((cell: any) => {
          const columnId = cell.column.id;
          const isUpdated = localUpdatedFields.includes(columnId);

          return (
            <td
              key={cell.id}
              className={`${styles.cell} ${isUpdated ? styles.highlightedCell : ""}`} >
              {cell.getValue()}
            </td>
          );
        })}
      </tr>
    );
  },
  areEqual
);

function areEqual(prevProps: Props, nextProps: Props) {
  const prevRow = prevProps.row.original;
  const nextRow = nextProps.row.original;

  const sameData =
    (prevRow.macId === nextRow.macId &&
      prevRow.status === nextRow.status &&
      prevRow.connectivity === nextRow.connectivity 
    );

  const prevUpdated = prevProps.updatedFieldsMap?.[prevRow.macId] ?? [];
  const nextUpdated = nextProps.updatedFieldsMap?.[nextRow.macId] ?? [];

  const sameUpdates =
    prevUpdated.length === nextUpdated.length &&
    prevUpdated.every((field, i) => field === nextUpdated[i]);

  return sameData && sameUpdates;
}

export default TableRow;
