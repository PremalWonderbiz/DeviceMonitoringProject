import { HStack, Tag } from "@chakra-ui/react";
import styles from "@/styles/scss/AlarmPanel.module.scss";
import { useEffect, useState } from "react";
import { getLatestAlarms } from "@/services/alarmservice";
import { formatRelativeTime } from "@/utils/helperfunctions";


export const DeviceTags = ({ tags, removeTag }: any) => {
  console.log(tags);

  return (
    <HStack paddingLeft={"0.3rem"} gap={"0.5rem"} wrap={"wrap"}>
      {tags.map((tag: any, index: any) => (
        <Tag.Root key={index} variant="outline" colorPalette={"gray"} color="black" borderRadius="lg" padding="0.2rem 0.6rem" size="md">
          <Tag.Label>{tag.deviceName}</Tag.Label>
          <Tag.EndElement>
            <Tag.CloseTrigger cursor={"pointer"} onClick={() => removeTag(index)} />
          </Tag.EndElement>
        </Tag.Root>
      ))}
    </HStack>
  );
};


export const AlarmPopUp = ({setIsAlarmPanelOpen, latestAlarms, totalAlarms} : any) => {  
  const severityColors: Record<string, { bg: string; color: string }> = {
    Critical: { bg: 'criticalAlarm', color: 'light' },
    Warning: { bg: 'warningAlarm', color: 'dark' },
    Information: { bg: 'infoAlarm', color: 'light' },
  };

  return (
    <div className={`${styles.alarmPopOverSection} `}>
      {latestAlarms.map((alarm: any) => {
        return (
          <div className={`${styles.alarmPopUpAlarmCard}`} key={alarm.id}>
            <span className={`${styles.severityDot} ${styles[`severityDotBg--${severityColors[alarm.severity].bg}`]}`} />
            <div>
              <p className={styles.message}>{alarm.message}</p>
              <span className={styles.time}>{formatRelativeTime(alarm.raisedAt)}</span>
            </div>
          </div>
        );
      })}
        <button onClick={(event: any) => { event.stopPropagation(); setIsAlarmPanelOpen(true) }} className={styles.viewBtn}>View all</button>
    </div>
  );  
}