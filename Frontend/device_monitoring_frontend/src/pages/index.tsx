import { Geist, Geist_Mono } from "next/font/google";
import Badge from "@/components/customcomponents/Badge";
import Sidebar from "@/components/customcomponents/SideBar";
import PropertyPanel from "@/components/customcomponents/Propertypanel/PropertyPannel";
import TableComponent from "@/components/customcomponents/Table/TableComponent";
import AlarmPanel from "@/components/customcomponents/AlarmPanel/AlarmPanel";
import { useCallback, useEffect, useState } from "react";
import { useDevicesTopDataSocket } from "@/utils/customhooks/useDevicesTopDataSocket";
import { BellRing, RefreshCw, Repeat, UserPen } from "lucide-react";
import { getDevicesTopLevelData, getMacIdToFileNameMap, getSearchedDeviceMetadataPaginated } from "@/services/deviceservice";
import styles from "@/styles/scss/Home.module.scss";
import PopOver from "@/components/chakrauicomponents/PopOver";
import { AlarmPopUp, ProfilePopUp } from "@/components/customcomponents/AlarmPanel/AlarmPanelContent";
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
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [deviceFileNames, setDeviceFileNames] = useState<any>();
  const initialTabState = "Health Tab"; // Default active tab
  const [activeTab, setActiveTab] = useState(initialTabState);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState<boolean>(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [currentDeviceFileName, setCurrentDeviceFileName] = useState<string | null>(null);
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState<boolean>(false);
  const [isAlarmPopOverOpen, setIsAlarmPopOverOpen] = useState<boolean>(false);
  const [isProfilePopOverOpen, setIsProfilePopOverOpen] = useState<boolean>(false);
  const [latestAlarms, setLatestAlarms] = useState<any[]>([]);
  const [totalAlarms, setTotalAlarms] = useState<any>(0);
  const [selectedDevicePropertyPanel, setSelectedDevicePropertyPanel] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshDeviceDataKey, setRefreshDeviceDataKey] = useState(0);
  const [searchInput, setSearchInput] = useState<any>(null);
  const [updatedFieldsMap, setUpdatedFieldsMap] = useState<{ [macId: string]: string[] } | null>(null);

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / pageSize));
    setCurrentPage(1);
  }, [pageSize, totalCount]);

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
      const changedFieldMap: { [macId: string]: string[] } = {};


      const updatedDevices = prevDevices.map((existingDevice) => {
        const incomingDevice = incomingDevices.find(
          (d: any) => d.MacId === existingDevice.macId
        );

        if (!incomingDevice) return existingDevice;

        const changedFields: string[] = [];

        if (incomingDevice.Status !== existingDevice.status) {
          changedFields.push("status");
        }
        if (incomingDevice.Connectivity !== existingDevice.connectivity) {
          changedFields.push("connectivity");
        }

        if (changedFields.length > 0) {
          hasChange = true;
          counter++;
          changedFieldMap[existingDevice.macId] = changedFields;

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
        setUpdatedFieldsMap(changedFieldMap);
        return updatedDevices;

      } else {
        console.log("No change in status/connectivity; skipping update");
        return prevDevices;
      }

    });
  }, []);

  const handleAlertUpdates = useCallback((msg: string) => {
    const incomingUpdates = JSON.parse(msg);

    setLatestAlarms(incomingUpdates.alarms);
    setTotalAlarms(incomingUpdates.totalAlarms);
  }, []);

  // SignalR connection for devices top level data
  useDevicesTopDataSocket(handleUpdate);

  //signalR for alarms data
  useDeviceAlertSocket("sampleDeviceId", handleAlertUpdates, "ReceiveMainPageUpdates");

  // Initial data fetch
  useEffect(() => {
    const fetchDevicesFileNames = async () => {
      const response = await getMacIdToFileNameMap();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDeviceFileNames(response.data);
      }
    };
    fetchDevicesFileNames();
  }, []);

  useEffect(() => {
    const fetchDevicesData = async () => {
      const response = await getDevicesTopLevelData(currentPage, pageSize);
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDeviceData(response.data.data);
        setTotalCount(response.data.totalCount);
      }
    };

    fetchDevicesData();
  }, [pageSize, currentPage, refreshDeviceDataKey]);

  useEffect(() => {
    if (searchInput == "") {      
      setRefreshDeviceDataKey(prev => prev + 1);
    }
    else if (searchInput != null) {
      const fetchSearchedDevicesData = setTimeout(async () => {
        const response = await getSearchedDeviceMetadataPaginated(currentPage, pageSize, searchInput);
        if (!response)
          console.log("Network response was not ok");

        if (response && response.data) {
          setDeviceData(response.data.data);
          setTotalCount(response.data.totalCount);
        }
      }, 1000)

      return () => clearTimeout(fetchSearchedDevicesData)
    }
  }, [searchInput]);

  const openPropertypanel = (deviceId: string) => {
    setActiveTab(initialTabState); // Reset to default tab
    setIsPropertyPanelOpen(true);
    setCurrentDeviceFileName(deviceFileNames[deviceId] || null);
    setCurrentDeviceId(deviceId);
  }

  return (
    <div>
      <div className={styles.upperNav}>
        <div onMouseEnter={() => setIsAlarmPopOverOpen(true)} onMouseLeave={() => setIsAlarmPopOverOpen(false)}>
          <PopOver isOpen={isAlarmPopOverOpen}
            triggerContent={
              <div className={styles.alarmIconContainer}>
                <BellRing cursor="pointer" size={25} fill="#fbc02d"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    setIsAlarmPanelOpen((prev) => !prev);
                  }}
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
        <div onMouseEnter={() => setIsProfilePopOverOpen(true)} onMouseLeave={() => setIsProfilePopOverOpen(false)}>
          <PopOver isOpen={isProfilePopOverOpen}
            triggerContent={
              <div className={styles.alarmIconContainer}>
                <UserPen cursor="pointer" size={25} fill="#000" />
              </div>
            }
          >
            <ProfilePopUp />
          </PopOver>
        </div>
      </div>

      <div className='m-3'>
        <Sidebar position="left" isOpen={isAlarmPanelOpen} setIsOpen={setIsAlarmPanelOpen} >
          {isAlarmPanelOpen && <AlarmPanel setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} selectedDevicePropertyPanel={selectedDevicePropertyPanel} />}
        </Sidebar>

        <div>
          <span className={`py-3 ${styles.mainPageTitle}`}>Welcome back, Premal Kadam</span>
          <div className={`py-2 pr-4 ${styles.subNav}`}>
            <input onChange={(event: any) => { setSearchInput(event.target.value) }} className={styles.mainPageSearchInput} type="search" placeholder="Search..." />
            <Repeat className={styles.deviceRefreshIcon} onClick={() => { setRefreshDeviceDataKey(prev => prev + 1) }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
          </div>
        </div>

        <div className={styles.bodyContainer}>
          <div className={`${styles.pageWrapper} ${isPropertyPanelOpen ? styles.pushRight : ''}`}>
            <TableComponent refreshDeviceDataKey={refreshDeviceDataKey} updatedFieldsMap={updatedFieldsMap} totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} setCurrentPage={setCurrentPage} currentPage={currentPage} data={deviceData} setIsPropertyPanelOpen={openPropertypanel} />
          </div>
          <Sidebar position="right" isOpen={isPropertyPanelOpen} setIsOpen={setIsPropertyPanelOpen}>
            {isPropertyPanelOpen && <PropertyPanel setIsAlarmPanelOpen={setIsAlarmPanelOpen} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} activeTab={activeTab} setActiveTab={setActiveTab} currentDeviceId={currentDeviceId} currentDeviceFileName={currentDeviceFileName} />}
          </Sidebar>
        </div>
      </div>
    </div>
  );
};
