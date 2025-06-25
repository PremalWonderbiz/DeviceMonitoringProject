import { Geist, Geist_Mono } from "next/font/google";
import Badge from "@/components/customcomponents/Badge";
import Sidebar from "@/components/customcomponents/SideBar";
import PropertyPanel from "@/components/customcomponents/Propertypanel/PropertyPannel";
import TableComponent from "@/components/customcomponents/Table/TableComponent";
import AlarmPanel from "@/components/customcomponents/AlarmPanel/AlarmPanel";
import { useCallback, useEffect, useState } from "react";
import { useDevicesTopDataSocket } from "@/utils/customhooks/useDevicesTopDataSocket";
import { BellRing } from "lucide-react";
import { getDevicesTopLevelData, getMacIdToFileNameMap } from "@/services/deviceservice";
import styles from "@/styles/scss/Home.module.scss";
import PopOver from "@/components/chakrauicomponents/PopOver";
import { AlarmPopUp } from "@/components/customcomponents/AlarmPanel/AlarmPanelContent";
import { getLatestAlarms } from "@/services/alarmservice";
import { useDeviceAlertSocket } from "@/utils/customhooks/useDeviceAlertSocket";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [deviceFileNames, setDeviceFileNames] = useState<any>();
  const initialTabState = "Health Tab"; // Default active tab
  const [activeTab, setActiveTab] = useState(initialTabState);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState<boolean>(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [currentDeviceFileName, setCurrentDeviceFileName] = useState<string | null>(null);
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState<boolean>(false);
  const [isAlarmPopOverOpen, setIsAlarmPopOverOpen] = useState<boolean>(false);
  const [latestAlarms, setLatestAlarms] = useState<any[]>([]);
  const [totalAlarms, setTotalAlarms] = useState<any>(0);
  const [selectedDevicePropertyPanel, setSelectedDevicePropertyPanel] = useState<any>(null);

  useEffect(() => {
    const fetchLatestAlarmData = async () => {
      const response = await getLatestAlarms();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setLatestAlarms(response.data.alarms);
        setTotalAlarms(response.data.totalAlarms);
      }
    };

    fetchLatestAlarmData();
  }, []);

  // Handle incoming SignalR updates
  const handleUpdate = useCallback((msg: string) => {
    const incomingDevices = JSON.parse(msg); // Format: [{ MacId, Status, Connectivity }]
    
    setDeviceData((prevDevices) => {

      let hasChange = false;
      let counter = 0;

      const updatedDevices = prevDevices.map((existingDevice) => {
        const incomingDevice = incomingDevices.find(
          (d: any) => d.MacId === existingDevice.macId
        );

        if (
          incomingDevice &&
          (incomingDevice.Status !== existingDevice.status ||
            incomingDevice.Connectivity !== existingDevice.connectivity)
        ) {
          counter++;
          hasChange = true;

          return {
            ...existingDevice,
            status: incomingDevice.Status,
            connectivity: incomingDevice.Connectivity,
          };
        }

        return existingDevice;
      });


      if (hasChange) {
        console.log("Updating deviceData due to change in status/connectivity", counter);
        return updatedDevices;

      } else {
        console.log("No change in status/connectivity; skipping update");
        return prevDevices;
      }

    });
  }, []);

  const handleAlertUpdates = useCallback((msg : string) => {
    const incomingUpdates = JSON.parse(msg);
    
    setLatestAlarms(incomingUpdates.alarms);
    setTotalAlarms(incomingUpdates.totalAlarms);
  }, []);

  // SignalR connection for devices top level data
  useDevicesTopDataSocket(handleUpdate);

  //signalR for alarms data
  useDeviceAlertSocket("sampleDeviceId",handleAlertUpdates,"ReceiveMainPageUpdates");

  // Initial data fetch
  useEffect(() => {
    const fetchDevicesData = async () => {
      const response = await getDevicesTopLevelData(1, 10);
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDeviceData(response.data.data);
      }
    };

    const fetchDevicesFileNames = async () => {
      const response = await getMacIdToFileNameMap();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDeviceFileNames(response.data);
      }
    };
    fetchDevicesData();
    fetchDevicesFileNames();
  }, []);

  const openPropertypanel = (deviceId: string) => {
    setActiveTab(initialTabState); // Reset to default tab
    setIsPropertyPanelOpen(true);
    setCurrentDeviceFileName(deviceFileNames[deviceId] || null);
    setCurrentDeviceId(deviceId);
  }

  return (
    <div className='m-3'>
      <Sidebar position="left" isOpen={isAlarmPanelOpen} setIsOpen={setIsAlarmPanelOpen} >
        {isAlarmPanelOpen && <AlarmPanel setSelectedDevicePropertyPanel = {setSelectedDevicePropertyPanel} selectedDevicePropertyPanel = {selectedDevicePropertyPanel}/>}
      </Sidebar>

      <div className={styles.homePageNav}>
        <span className="py-3 px-2">Device Monitoring System</span>
        <div
          className={styles.alarmWrapper}
          onMouseEnter={() => setIsAlarmPopOverOpen(true)}
          onMouseLeave={() => setIsAlarmPopOverOpen(false)}
        >
         <PopOver
            isOpen={isAlarmPopOverOpen}
            triggerContent={
              <div className={styles.alarmIconContainer}>
                <BellRing
                  cursor="pointer"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    setIsAlarmPanelOpen((prev) => !prev);
                  }}
                  className="mr-4"
                  size={30}
                  fill="#fbc02d"
                />
                <div className={styles.badgeConainer}>
                  <Badge label={totalAlarms} bgColor="darkgray" textColor="light" />
                </div>
              </div>
            }
          >
             {(latestAlarms && latestAlarms.length > 0) && (<AlarmPopUp latestAlarms={latestAlarms} totalAlarms={totalAlarms} setIsAlarmPanelOpen={setIsAlarmPanelOpen} />)}
          </PopOver>
          
        </div>
      </div>

      <div className={styles.bodyContainer}>
        <div className={`${styles.pageWrapper} ${isPropertyPanelOpen ? styles.pushRight : ''}`}>
          <TableComponent data={deviceData} setIsPropertyPanelOpen={openPropertypanel} />
        </div>
        <Sidebar position="right" isOpen={isPropertyPanelOpen} setIsOpen={setIsPropertyPanelOpen}>
          {isPropertyPanelOpen && <PropertyPanel setIsAlarmPanelOpen={setIsAlarmPanelOpen} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} activeTab={activeTab} setActiveTab={setActiveTab} currentDeviceId={currentDeviceId} currentDeviceFileName={currentDeviceFileName} />}
        </Sidebar>
      </div>
    </div>
  );
};
