import { HStack, Tag } from "@chakra-ui/react";
import styles from "@/styles/scss/AlarmPanel.module.scss";
import { formatRelativeTime } from "@/utils/helperfunctions";


export const DeviceTags = ({ tags, removeTag }: any) => {
  return (
    <HStack gap={"0.5rem"} wrap={"wrap"}>
      {tags.map((tag: any, index: any) => (
        <CustomTag tag={tag.deviceName} index={index} removeTag={removeTag}/>
      ))}
    </HStack>
  );
};

export const CustomTag = ({ tag, index, removeTag }: any) => {
  return (
    <Tag.Root key={index} variant="outline" colorPalette={"gray"} color="black" borderRadius="lg" padding="0.2rem 0.6rem" size="md">
      <Tag.Label>{tag}</Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger cursor={"pointer"} onClick={() => removeTag(index)} />
      </Tag.EndElement>
    </Tag.Root>
  )
}


export const AlarmPopUp = ({ setIsAlarmPanelOpen, latestAlarms, totalAlarms }: any) => {
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

export const ProfilePopUp = () => {
  return (
    <div className={`${styles.alarmPopOverSection} `}>
      <span className={`py-3 px-2 ${styles.profilePopUpTitle}`}>Welcome, Premal Kadam</span>
      <p className="px-2"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, animi cumque! Aliquid amet molestiae, adipisci sunt vero facilis saepe obcaecati ducimus dolores optio corrupti earum! Alias in omnis iure nisi. </p>
    </div>
  );
}