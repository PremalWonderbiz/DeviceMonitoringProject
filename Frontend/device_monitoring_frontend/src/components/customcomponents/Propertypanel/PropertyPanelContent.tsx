import React, { useCallback, useEffect, useState } from "react";
import Accordion from "../Accordion";
import styles from "@/styles/scss/PropertyPanel.module.scss";
import Badge from "../Badge";
import { getLatestAlarmForDevice } from "@/services/alarmservice";
import { formatRelativeTime } from "@/utils/helperfunctions";
import { useDeviceAlertSocket } from "@/utils/customhooks/useDeviceAlertSocket";

export const StaticTabContent = React.memo(({ staticProps }: { staticProps: any }) => {
    return (
        <div className={`${styles.propertyPanelTabContent}`}>
            {Object.entries(staticProps).map(([key, value]: any) => {
                if (typeof value === "object" && value !== null)
                    return renderObject(key, value);
                else
                    return (
                        <div className={styles.keyValueSection} key={key}>
                            {renderKeyValueSection(key, value, 0)}
                        </div>
                    );
            })}
        </div>
    );
});

export const HealthTabContent = React.memo(({ deviceName, setIsAlarmPanelOpen, setSelectedDevicePropertyPanel, deviceMacId, dynamicProps }: any) => {
    const [alarm, setAlarm] = useState<any>(null);
    const [totalAlarmsForDevice, setTotalAlarmsForDevice] = useState<any>(0);

    const handleAlertUpdates = ((msg: string) => {
        const incomingUpdates = JSON.parse(msg);
        if (incomingUpdates) {
            setAlarm(incomingUpdates.alarm);
            setTotalAlarmsForDevice(incomingUpdates.totalAlarms);
        } else {
            setAlarm(null);
            setTotalAlarmsForDevice(0);
        }
    });

    // SignalR connection for property panel alarm
    useDeviceAlertSocket(deviceMacId, handleAlertUpdates, "ReceivePropertyPanelAlarmUpdates");

    useEffect(() => {
        const fetchLatestAlarmData = async () => {
            const response = await getLatestAlarmForDevice(deviceMacId);
            if (!response)
                console.log("Network response was not ok");

            if (response && response.data) {
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
        <div className={`${styles.propertyPanelTabContent}`}>
            {alarm && (<div className={`${styles.alarmCard}`}>
                <div>
                    <p className={styles.message}>{alarm.message}</p>
                    <span className={styles.time}>{formatRelativeTime(alarm.raisedAt)}</span>
                    <div className={``} >
                        <button onClick={(event: any) => {
                            event.stopPropagation();
                            setIsAlarmPanelOpen(true);
                            setSelectedDevicePropertyPanel({ deviceMacId: deviceMacId, deviceName: deviceName });
                        }} className={styles.viewBtn}>
                            View related alarms
                            <span className="ml-2"><Badge label={totalAlarmsForDevice} bgColor="neutral" textColor="dark" /></span>
                        </button>
                    </div>
                </div>
            </div>)}
            {Object.entries(dynamicProps).map(([key, value]: any) => {
                if (typeof value === "object" && value !== null)
                    return renderObject(key, value);
                else
                    return (
                        <div className={styles.keyValueSection} key={key}>
                            {renderKeyValueSection(key, value, 0)}
                        </div>
                    );
            })}
        </div>
    );
}, (prevProps, nextProps) => {
    return (prevProps.dynamicProps === nextProps.dynamicProps);
});


export const renderKeyValueSection = (key: any, value: any, depth: any) => {
    if (typeof value === "boolean")
        value = value ? "Yes" : "No";

    return (
        <div className={styles.kvRow}>
            <span className={`${styles.kvKey} ${styles[`depth-${depth}`]}`}>{key}</span>
            <span className={styles.kvValue}> {value} </span>
        </div>)
}

export const renderObject = (key: any, data: any, depth = 1) => {
    if (!data || Object.keys(data).length === 0)
        return null;

    if (Array.isArray(data))
        return renderArray(key, data, depth);

    return (<Accordion title={<span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]}`}>{key}</span>} defaultOpen={true} bgColor='white'>
        <div className={styles.keyValueSection}>
            {Object.entries(data).map(([key, value]: any) => {
                if (typeof value === 'object' && value !== null) {
                    return renderObject(key, value, depth + 1);
                } else {
                    return renderKeyValueSection(key, value, depth + 1);
                }
            })}
        </div>
    </Accordion>)
}

export const renderArray = (key: any, data: any, depth: any) => {
    if (!data || data.length === 0)
        return null;

    let counter = 1;
    return (<Accordion title={<span className={`${styles.propertyPanelTitles} ${styles[`depth-${depth}`]}`}>{key}</span>} defaultOpen={true} bgColor='white'>
        <div className={styles.keyValueSection}>
            {data.map((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    return renderObject(`${key} ${counter++}`, item, depth + 1);
                } else {
                    return renderKeyValueSection(`${key} ${counter++}`, item, depth + 1);
                }
            })}
        </div>
    </Accordion>)
}


