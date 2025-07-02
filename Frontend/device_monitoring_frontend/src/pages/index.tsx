import { Geist, Geist_Mono } from "next/font/google";
import Badge from "@/components/customcomponents/Badge";
import Sidebar from "@/components/customcomponents/SideBar";
import PropertyPanel from "@/components/customcomponents/Propertypanel/PropertyPannel";
import TableComponent from "@/components/customcomponents/Table/TableComponent";
import AlarmPanel from "@/components/customcomponents/AlarmPanel/AlarmPanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDevicesTopDataSocket } from "@/utils/customhooks/useDevicesTopDataSocket";
import { BellRing, RefreshCw, Repeat, UserPen } from "lucide-react";
import { getDeviceMetadataPaginatedandSorted, getDevicesNameMacIdList, getDevicesTopLevelData, getMacIdToFileNameMap, getSearchedDeviceMetadataPaginated } from "@/services/deviceservice";
import styles from "@/styles/scss/Home.module.scss";
import PopOver from "@/components/chakrauicomponents/PopOver";
import { AlarmPopUp, ProfilePopUp } from "@/components/customcomponents/AlarmPanel/AlarmPanelContent";
import { getLatestAlarms } from "@/services/alarmservice";
import { useDeviceAlertSocket } from "@/utils/customhooks/useDeviceAlertSocket";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@chakra-ui/react";
import { SortingState } from "@tanstack/react-table";

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
  const initialTabState = "Health"; // Default active tab
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
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [devicesNameMacList, setDevicesNameMacList] = useState<any[] | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

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
    setSorting((prev : SortingState) => {
      return prev.filter(s => s.id != "status" && s.id != "connectivity")
    })
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
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = setTimeout(() => {
          setUpdatedFieldsMap(null);
        }, 3000);

        return updatedDevices;

      } else {
        console.log("No change in status/connectivity; skipping update");
        return prevDevices;
      }

    });
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
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

    const fetchDevicesData = async () => {
      const response = await getDevicesNameMacIdList();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDevicesNameMacList(response.data);
      }
    };

    fetchDevicesData();
    fetchDevicesFileNames();
  }, []);

  useEffect(() => {
    if (searchInput == "" || searchInput == null) {
      const fetchDevicesData = async () => {
        const response = await getDeviceMetadataPaginatedandSorted(currentPage, pageSize, sorting);
        if (!response)
          console.log("Network response was not ok");

        if (response && response.data) {
          setDeviceData(response.data.data);
          setTotalCount(response.data.totalCount);
        }
      };

      fetchDevicesData();
    }
  }, [pageSize, currentPage, refreshDeviceDataKey, sorting]);

  useEffect(() => {
    if (searchInput == "") {
      setRefreshDeviceDataKey(prev => prev + 1);
    }
    else if (searchInput != null) {
      const fetchSearchedDevicesData = setTimeout(async () => {
        const response = await getSearchedDeviceMetadataPaginated(currentPage, pageSize, searchInput, sorting);
        if (!response)
          console.log("Network response was not ok");

        if (response && response.data) {
          setDeviceData(response.data.data);
          setTotalCount(response.data.totalCount);
        }
      }, 1000)

      return () => clearTimeout(fetchSearchedDevicesData)
    }
  }, [searchInput, sorting]);

  const openPropertypanel = (deviceId: string) => {
    setActiveTab(initialTabState); // Reset to default tab
    setIsPropertyPanelOpen(true);
    setCurrentDeviceFileName(deviceFileNames[deviceId] || null);
    setCurrentDeviceId(deviceId);
  }

  const closePropertyPanel = () => {
    setIsPropertyPanelOpen(false);
    setCurrentDeviceId(null);
    setSelectedDevicePropertyPanel(null);
    setCurrentDeviceFileName(null);
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
          {isAlarmPanelOpen && <AlarmPanel devicesNameMacList={devicesNameMacList} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} selectedDevicePropertyPanel={selectedDevicePropertyPanel} />}
        </Sidebar>

        <div>
          <span className={`py-3 ${styles.mainPageTitle}`}>Welcome back, Premal Kadam</span>
          <div className={`py-2 pr-4 ${styles.subNav}`}>
            <input onChange={(event: any) => { setSearchInput(event.target.value) }} className={styles.mainPageSearchInput} type="search" placeholder="Search..." />
            <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">Manual refresh button</span>}>
              <Repeat className={styles.deviceRefreshIcon} onClick={() => { setRefreshDeviceDataKey(prev => prev + 1) }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
            </Tooltip>
          </div>
        </div>

        <div className={styles.bodyContainer}>
          <div className={`${styles.pageWrapper} ${isPropertyPanelOpen ? styles.pushRight : ''}`}>
            <TableComponent sorting={sorting} setSorting={setSorting} refreshDeviceDataKey={refreshDeviceDataKey} updatedFieldsMap={updatedFieldsMap} totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} setCurrentPage={setCurrentPage} currentPage={currentPage} data={deviceData} setIsPropertyPanelOpen={openPropertypanel} />
          </div>
          {(deviceData && deviceData.length > 0) &&
            <Sidebar position="right" isOpen={isPropertyPanelOpen} setIsOpen={setIsPropertyPanelOpen} closeSidebar={closePropertyPanel}>
              {isPropertyPanelOpen && <PropertyPanel deviceFileNames={deviceFileNames} devicesNameMacList={devicesNameMacList} setCurrentDeviceId={setCurrentDeviceId} setCurrentDeviceFileName={setCurrentDeviceFileName} setIsAlarmPanelOpen={setIsAlarmPanelOpen} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} activeTab={activeTab} setActiveTab={setActiveTab} currentDeviceId={currentDeviceId} currentDeviceFileName={currentDeviceFileName} />}
            </Sidebar>}
        </div>
      </div>
    </div>
  );
};
