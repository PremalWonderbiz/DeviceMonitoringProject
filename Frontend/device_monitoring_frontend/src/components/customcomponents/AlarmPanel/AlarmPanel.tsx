// components/AlarmPanel.tsx
import React, { useState } from 'react';
import styles from "@/styles/scss/AlarmPanel.module.scss";
import Badge from '../Badge';
import Modal from '@/components/chakrauicomponents/Modal';
import ComboBox from '@/components/chakrauicomponents/ComboBox';
import Accordion from '../Accordion';
import { DeviceTags } from './AlarmPanelContent';

interface Alarm {
  id: number;
  message: string;
  time: string;
  severity: 'Critical' | 'Warning' | 'Information';
  acknowledged: boolean;
}

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
]

export const alarms: Alarm[] = [
  {
    id: 1,
    message: 'Mobile Device Failed',
    time: '20 minutes ago',
    severity: 'Critical',
    acknowledged: false,
  },
  {
    id: 2,
    message: 'Mobile device disconnected',
    time: '20 minutes ago',
    severity: 'Warning',
    acknowledged: false,
  },
  {
    id: 3,
    message: 'NAC device restarted',
    time: '20 minutes ago',
    severity: 'Information',
    acknowledged: false,
  },
  {
    id: 4,
    message: 'Mobile device disconnected',
    time: '20 minutes ago',
    severity: 'Warning',
    acknowledged: true,
  },
  {
    id: 5,
    message: 'Mobile device disconnected',
    time: '20 minutes ago',
    severity: 'Warning',
    acknowledged: true,
  },
  {
    id: 6,
    message: 'Mobile device disconnected',
    time: '20 minutes ago',
    severity: 'Warning',
    acknowledged: true,
  }
];

const AlarmPanel = () => {
  const unacknowledged = alarms.filter(a => !a.acknowledged);
  const acknowledged = alarms.filter(a => a.acknowledged);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>(['Device 1', 'Device 2', 'Device 3', 'Device 4', 'Device 5', 'Device 6']);

  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const severityColors: Record<Alarm['severity'], { bg: string; color: string }> = {
    Critical: { bg: 'criticalAlarm', color: 'light' },
    Warning: { bg: 'warningAlarm', color: 'dark' },
    Information: { bg: 'infoAlarm', color: 'light' },
  };

  function ExpandAlarmCard(id: number) {
    setExpandedId((prev) => {
      if (prev === id) {
        return null; // Collapse if already expanded
      }
      return id; // Expand the clicked card
    })
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>Alarms
          <span className={styles.count}>
            <Badge label={alarms.length.toString()} bgColor="neutral" textColor="dark" />
          </span>
        </h2>
        <Modal title={"Alarm Panel Filters"} triggerButton={<button className={styles.filterBtn}>Apply Filters</button>}>
          <ComboBox skills={skills} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
        </Modal>
      </div>

      <div className={`${styles.filters} ${tags.length == 0 ? styles.zeroFilters : ''}`}>
        <DeviceTags tags={tags} removeTag={handleRemoveTag} />
      </div>

      <div className={styles.section}>
        <Accordion 
          title={<h3 className={styles.alarmPanelTitles}>Unacknowledged <span className={styles.sectionCount}>
            <Badge label={unacknowledged.length.toString()} bgColor="neutral" textColor="dark" />
            </span></h3>} defaultOpen={true} bgColor='white'>
          <div>
            {unacknowledged.map(alarm => {
              const isExpanded = expandedId === alarm.id;

              return (
                <div className={`${styles.alarmCard} ${styles.unacknowledged} ${isExpanded ? styles.expanded : ''}`} key={alarm.id} onClick={() => ExpandAlarmCard(alarm.id)} >
                  <div>
                    <p className={styles.message}>{alarm.message}</p>
                    <span className={styles.time}>{alarm.time}</span>
                    <div className={`${styles.expandedContent} ${isExpanded ? styles.show : ''}`} >
                      <button onClick={(event: any) => { event.stopPropagation() }} className={styles.ackBtn}>Acknowledge</button>
                    </div>
                  </div>
                  <div className={styles.rightSide}>
                    <Badge label={alarm.severity} bgColor={severityColors[alarm.severity].bg} textColor={severityColors[alarm.severity].color} />
                  </div>
                </div>
              );
            })}
          </div>
        </Accordion>
      </div>

      <div className={styles.section}>
        <Accordion
          title={<h3 className={styles.alarmPanelTitles}>Acknowledged <span className={styles.sectionCount}>
            <Badge label={acknowledged.length.toString()} bgColor="neutral" textColor="dark" />
          </span></h3>} defaultOpen={true} bgColor='white'
        >
          <div>
            {acknowledged.map(alarm => {
              return (
                <div className={`${styles.alarmCard}`} key={alarm.id}>
                  <div>
                    <p className={styles.message}>{alarm.message}</p>
                    <span className={styles.time}>{alarm.time}</span>
                  </div>
                  <div className={styles.rightSide}>
                    <Badge label={alarm.severity} bgColor={severityColors[alarm.severity].bg} textColor={severityColors[alarm.severity].color} />
                  </div>
                </div>
              );
            })}
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default AlarmPanel;