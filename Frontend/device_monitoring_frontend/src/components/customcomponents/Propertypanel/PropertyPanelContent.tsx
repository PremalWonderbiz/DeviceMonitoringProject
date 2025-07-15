import React, { useCallback, useEffect, useMemo, useState } from "react";
import Accordion from "../Accordion";
import styles from "@/styles/scss/PropertyPanel.module.scss";
import Badge from "../Badge";
import { getLatestAlarmForDevice } from "@/services/alarmservice";
import { formatRelativeTime, getCollapsedAncestorsToHighlight } from "@/utils/helperfunctions";
import { useDeviceAlertSocket } from "@/utils/customhooks/useDeviceAlertSocket";
import KeyValueField from "./KeyValueField";
import { AccordionStateProvider, useAccordionState } from "./AccordionVisibilityContext";

export const StaticTabContent = React.memo(({ staticProps }: { staticProps: any }) => {
  return (
    <div className={`${styles.propertyPanelTabContent}`}>
      {Object.entries(staticProps).map(([key, value]: any) => {
        if (typeof value === "object" && value !== null)
          return renderObject(key, value, 1, "", [], new Set());
        else
          return (
            <div className={styles.keyValueSection} key={key}>
              {renderKeyValueSection(key, value, 0, "", [])}
            </div>
          );
      })}
    </div>
  );
});

export const HealthTabContent = React.memo(
  ({
    highlightedPaths,
    deviceName,
    setIsAlarmPanelOpen,
    setSelectedDevicePropertyPanel,
    deviceMacId,
    dynamicProps,
  }: any) => {
    const [alarm, setAlarm] = useState<any>(null);
    const [totalAlarmsForDevice, setTotalAlarmsForDevice] = useState<any>(0);
    const accordionContext = useAccordionState();

    const collapsedTitlesToHighlight = useMemo(() => {
      return getCollapsedAncestorsToHighlight(highlightedPaths, accordionContext?.state || {});
    }, [highlightedPaths, accordionContext?.state]);

    const handleAlertUpdates = (msg: string) => {
      const incomingUpdates = JSON.parse(msg);
      if (incomingUpdates) {
        setAlarm(incomingUpdates.alarm);
        setTotalAlarmsForDevice(incomingUpdates.totalAlarms);
      } else {
        setAlarm(null);
        setTotalAlarmsForDevice(0);
      }
    };

    useDeviceAlertSocket(deviceMacId, handleAlertUpdates, "ReceivePropertyPanelAlarmUpdates");

    useEffect(() => {
      const fetchLatestAlarmData = async () => {
        const response = await getLatestAlarmForDevice(deviceMacId);
        if (response?.data) {
          setAlarm(response.data.alarm);
          setTotalAlarmsForDevice(response.data.totalAlarms);
        } else {
          setAlarm(null);
          setTotalAlarmsForDevice(0);
        }
      };

      fetchLatestAlarmData();
    }, [deviceMacId]);

    return (
      <div className={styles.propertyPanelTabContent}>
        {alarm && (
          <div className={styles.alarmCard}>
            <div>
              <p className={styles.message}>{alarm.message}</p>
              <span className={styles.time}>{formatRelativeTime(alarm.raisedAt)}</span>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAlarmPanelOpen(true);
                    setSelectedDevicePropertyPanel({ deviceMacId, deviceName });
                  }}
                  className={styles.viewBtn}
                >
                  View related alarms
                  <span className="ml-2">
                    <Badge label={totalAlarmsForDevice} bgColor="neutral" textColor="dark" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {Object.entries(dynamicProps).map(([key, value]: any) => {
          if (typeof value === "object" && value !== null)
            return renderObject(key, value, 1, "", highlightedPaths, collapsedTitlesToHighlight);
          else
            return (
              <div className={styles.keyValueSection} key={key}>
                {renderKeyValueSection(key, value, 0, "", highlightedPaths)}
              </div>
            );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.deviceMacId === nextProps.deviceMacId &&
      JSON.stringify(prevProps.highlightedPaths) === JSON.stringify(nextProps.highlightedPaths)
    );

  }
);

export const renderKeyValueSection = (
  key: string,
  value: any,
  depth: number,
  parentPath: string,
  highlightedPaths: string[]
) => {
  const fullPath = parentPath ? `${parentPath}.${key}` : key;
  return (
    <KeyValueField
      key={fullPath}
      keyName={key}
      value={value}
      depth={depth}
      fullPath={fullPath}
      highlightedPaths={highlightedPaths}
    />
  );
};

export const renderObject = (
  key: string,
  data: any,
  depth = 1,
  parentPath = "",
  highlightedPaths: string[],
  collapsedTitlesToHighlight: Set<string>,
) => {
  const fullPath = parentPath ? `${parentPath}.${key}` : key;
  const shouldHighlightTitle = collapsedTitlesToHighlight.has(fullPath);

  if (!data || typeof data !== "object") return null;

  if (Array.isArray(data)) {
    return renderArray(key, data, depth, parentPath, highlightedPaths, collapsedTitlesToHighlight);
  }

  return (
    <Accordion
      keyPath={fullPath}
      key={fullPath}
      title={
        <span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]} ${shouldHighlightTitle ? styles.highlightedTitle : ""}`}>
          {key}
        </span>
      }
      defaultOpen={true}
      bgColor="white"
    >
      <div className={styles.keyValueSection}>
        {Object.entries(data).map(([childKey, childVal]) => {
          const childPath = `${fullPath}.${childKey}`;
          if (Array.isArray(childVal)) {
            return renderArray(childKey, childVal, depth + 1, fullPath, highlightedPaths, collapsedTitlesToHighlight);
          } else if (typeof childVal === "object" && childVal !== null) {
            return renderObject(childKey, childVal, depth + 1, fullPath, highlightedPaths, collapsedTitlesToHighlight);
          } else {
            return renderKeyValueSection(childKey, childVal, depth + 1, fullPath, highlightedPaths);
          }
        })}
      </div>
    </Accordion>
  );
};

export const renderArray = (
  key: string,
  data: any[],
  depth: number,
  parentPath = "",
  highlightedPaths: string[],
  collapsedTitlesToHighlight: Set<string>
) => {
  if (!data || data.length === 0) return null;

  const fullPath = parentPath ? `${parentPath}.${key}` : key;
  const shouldHighlightTitle = collapsedTitlesToHighlight.has(fullPath);

  return (
    <Accordion
      keyPath={fullPath}
      key={fullPath}
      title={
        <span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]} ${shouldHighlightTitle ? styles.highlightedTitle : ""}`}>
          {key}
        </span>
      }
      defaultOpen={true}
      bgColor="white"
    >
      <div className={styles.keyValueSection}>
        {data.map((item, idx) => {
          const itemPath = `${fullPath}`;

          const displayLabel = `${key} ${idx}`;

          if (typeof item === "object" && item !== null) {
            return renderObject(displayLabel, item, depth + 1, itemPath, highlightedPaths, collapsedTitlesToHighlight);
          } else {
            return renderKeyValueSection(displayLabel, item, depth + 1, itemPath, highlightedPaths);
          }
        })}
      </div>
    </Accordion>
  );
};




