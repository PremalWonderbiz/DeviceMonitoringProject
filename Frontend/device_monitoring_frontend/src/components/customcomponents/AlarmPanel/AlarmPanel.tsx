// components/AlarmPanel.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from "@/styles/scss/AlarmPanel.module.scss";
import Badge from '../Badge';
import Accordion from '../Accordion';
import { acknowledgeAlarm, getAlarmPanelData, getAlarmStates, resolveAlarm } from '@/services/alarmservice';
import { formatRelativeTime } from '@/utils/helperfunctions';
import { useDeviceAlertSocket } from '@/utils/customhooks/useDeviceAlertSocket';
import ComboBox from '@/components/chakrauicomponents/ComboBox';
import { DateRangePicker } from 'rsuite';
import { Badge as ChakraBadge, CloseButton, Wrap } from "@chakra-ui/react";
import AlarmCard from './AlarmCard';


const priorityMap: any = {
  Critical: 0,
  Warning: 1,
  Information: 2,
};

const AlarmPanel = ({ devicesNameMacList, selectedDevicePropertyPanel, setSelectedDevicePropertyPanel }: any) => {
  const [unacknowledgedAlarms, setUnacknowledgedAlarms] = useState<any[]>([]);
  const [acknowledgedAlarms, setAcknowledgedAlarms] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [shouldConnectSignalR, setShouldConnectSignalR] = useState<boolean>(true);
  const [alarmStates, setAlarmStates] = useState<any[]>([]);
  const [isResolveCommentModalOpen, setIsResolveCommentModalOpen] = useState(false);

  const handleAlertUpdates = useCallback((msg: string) => {
    const incomingUpdates = JSON.parse(msg);
    if (incomingUpdates) {
      filterAndSortAlarms(incomingUpdates);
    }
  }, []);

  // SignalR connection for alarm panel data  
  useDeviceAlertSocket("sampleDeviceId", handleAlertUpdates, "ReceiveAlarmPanelUpdates", shouldConnectSignalR);

  const handleRemoveTag = (index: number) => {
    setSelectedDevices((prev: any) => prev.filter((_: any, i: any) => i !== index));
  };

  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const severityColors: Record<string, { bg: string; color: string }> = {
    Critical: { bg: 'criticalAlarm', color: 'light' },
    Warning: { bg: 'warningAlarm', color: 'dark' },
    Information: { bg: 'infoAlarm', color: 'light' },
  };

  const fetchData = async (selectedDevices: any[], dateRange: any) => {
    const response = await getAlarmPanelData({ "devices": selectedDevices || [], "filterDateRange": dateRange || [] });
    if (!response)
      console.log("Network response was not ok");

    if (response && response.data) {
      filterAndSortAlarms(response.data);
    }
  };

  useEffect(() => {
    if (devicesNameMacList)
      setDevices(devicesNameMacList)
  }, []);

  useEffect(() => {
    const fetchAlarmStates = async () => {
      const response = await getAlarmStates();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setAlarmStates(response.data);
      }
    };

    fetchAlarmStates();
  }, []);

  useEffect(() => {
    if (!selectedDevicePropertyPanel) {
      fetchData(selectedDevices.map((s: any) => s.deviceMacId), dateRange);
      (selectedDevices.length == 0 && dateRange == null) ? setShouldConnectSignalR(true) : setShouldConnectSignalR(false);
    }
  }, [selectedDevices, dateRange]);

  useEffect(() => {
    if (selectedDevicePropertyPanel) {
      setSelectedDevices([selectedDevicePropertyPanel]);
      setSelectedDevicePropertyPanel(null);
    }
  }, [selectedDevicePropertyPanel]);

  function filterAndSortAlarms(data: any) {
    setAcknowledgedAlarms(sortAlarmsDataBySeverity(data.filter((alarm: any) => alarm.isAcknowledged)));
    setUnacknowledgedAlarms(sortAlarmsDataBySeverity(data.filter((alarm: any) => !alarm.isAcknowledged)));
  }

  function sortAlarmsDataBySeverity(alarms: any) {
    return alarms.sort((a: any, b: any) => {
      const severityDiff = priorityMap[a.severity] - priorityMap[b.severity];
      if (severityDiff !== 0) return severityDiff;

      // If same severity, sort by date (newest first)
      return new Date(b.raisedAt).getTime() - new Date(a.raisedAt).getTime();
    });
  }

  function ExpandAlarmCard(id: number) {
    setExpandedId((prev) => {
      if (prev === id) {
        return null; // Collapse if already expanded
      }
      return id; // Expand the clicked card
    })
  }

  const acknowledgeAlarmData = async (alarmId: any) => {
    const response = await acknowledgeAlarm(alarmId);
    if (!response)
      console.log("Network response was not ok");

    if (response && response.data) {
      const ackAlarm = unacknowledgedAlarms.find((a: any) => a.id == alarmId);
      setUnacknowledgedAlarms((prev: any) => prev.filter((a: any) => a.id != alarmId));
      const ackAlarms = [ackAlarm, ...acknowledgedAlarms];
      setAcknowledgedAlarms(sortAlarmsDataBySeverity(ackAlarms));
    }
  }

  const resolveAlarmData = async (alarmId: any, input : any) => {
    const response = await resolveAlarm(alarmId,input);
    if (!response)
      console.log("Network response was not ok");

    if (response && response.data) {
      const ackAlarm = unacknowledgedAlarms.find((a: any) => a.id == alarmId);
      setUnacknowledgedAlarms((prev: any) => prev.filter((a: any) => a.id != alarmId));
      const ackAlarms = [ackAlarm, ...acknowledgedAlarms];
      setAcknowledgedAlarms(sortAlarmsDataBySeverity(ackAlarms));
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>Alarms
          <span className={styles.count}>
            <Badge label={(unacknowledgedAlarms.length + acknowledgedAlarms.length).toString()} bgColor="neutral" textColor="dark" />
          </span>
        </h2>
        {/* <Modal dateRange={dateRange} setDateRange={setDateRange} title={"Alarm Panel Filters"} triggerButton={<Funnel cursor={"pointer"} />} devices={devices} selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} /> */}
      </div>

      <div className={styles.selectFilters}>
        <ComboBox devices={devices} selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} />

        {dateRange && <Wrap gap="2">
          <ChakraBadge padding="0.25rem 0 0.25rem 0.4rem" display="flex" alignItems="center" gap="0.2rem" fontSize={"0.7rem"}>
            {`${dateRange[0].toLocaleDateString()} ~ ${dateRange[1].toLocaleDateString()}`}
            <CloseButton size={"sm"} boxSize="0.1em" cursor="pointer" onClick={(e) => { e.stopPropagation(); setDateRange(null) }} />
          </ChakraBadge>
        </Wrap>}
        <DateRangePicker value={dateRange} onChange={(value) => { setDateRange(value) }} placeholder="Select Date Range" placement="bottomStart" />
      </div>

      <div className={styles.section}>
        <Accordion
          title={<h3 className={styles.alarmPanelTitles}>Unacknowledged <span className={styles.sectionCount}>
            <Badge label={unacknowledgedAlarms.length.toString()} bgColor="neutral" textColor="dark" />
          </span></h3>} defaultOpen={true} bgColor='white'>

          <div className={`${styles.alarmsAccordionSection} ${(selectedDevices.length > 0) ? styles.alarmsAccordionSectionHeightWithSelectedDevices : null} ${(selectedDevices.length == 0 && dateRange == null) ? styles.alarmsAccordionSectionHeight : null}`}>
            {unacknowledgedAlarms.map(alarm => {
              const isExpanded = expandedId === alarm.id;

              return (
                <div className={`${styles.alarmCard} ${styles.unacknowledged} ${isExpanded ? styles.expanded : ''}`} key={alarm.id} onClick={() => ExpandAlarmCard(alarm.id)} >
                  
                <AlarmCard key={alarm.id} alarm={alarm} acknowledgeAlarm={acknowledgeAlarmData} resolveAlarm ={resolveAlarmData}/>

                </div>
              );
            })}
          </div>
        </Accordion>
      </div>

      <div className={styles.section}>
        <Accordion
          title={<h3 className={styles.alarmPanelTitles}>Acknowledged <span className={styles.sectionCount}>
            <Badge label={acknowledgedAlarms.length.toString()} bgColor="neutral" textColor="dark" />
          </span></h3>} defaultOpen={true} bgColor='white'
        >
          <div className={`${styles.alarmsAccordionSection} ${(selectedDevices.length > 0) ? styles.alarmsAccordionSectionHeightWithSelectedDevices : null}  ${(selectedDevices.length == 0 && dateRange == null) ? styles.alarmsAccordionSectionHeight : null}`}>
            {acknowledgedAlarms.map(alarm => {
              return (
                <div className={`${styles.alarmCard}`} key={alarm.id}>
                  <div className={`${styles.alarmCardDiv}`}>
                    <div>
                      <p className={styles.message}>{alarm.message}</p>
                      <span className={styles.time}>{formatRelativeTime(alarm.raisedAt)}</span>
                    </div>

                    <div className={styles.rightSide}>
                      <Badge label={alarm.severity} bgColor={severityColors[alarm.severity].bg} textColor={severityColors[alarm.severity].color} />
                    </div>
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