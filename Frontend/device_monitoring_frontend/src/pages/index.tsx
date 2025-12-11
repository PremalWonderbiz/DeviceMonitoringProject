// adding comment to test pipeline v2
// testing branch rules for pr
//tesing for sonarqube in pipeline v2
//tesing for sonarqube and coverity in pipeline v2
//tesing for generic pipeline pipeline v15
import { Geist, Geist_Mono } from "next/font/google";
import Badge from "@/components/customcomponents/Badge";
import Sidebar from "@/components/customcomponents/SideBar";
import PropertyPanel from "@/components/customcomponents/Propertypanel/PropertyPannel";
import TableComponent from "@/components/customcomponents/Table/TableComponent";
import AlarmPanel from "@/components/customcomponents/AlarmPanel/AlarmPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDevicesTopDataSocket } from "@/utils/customhooks/useDevicesTopDataSocket";
import { BellRing, Download, ListX, Menu, Repeat, UserPen } from "lucide-react";
import { getAlarmToggleValue, getAllDataRefereshedFromCache, getDeviceMetadata, getDeviceMetadataPaginatedandSorted, getDevicesNameMacIdList, getDevicesTopLevelData, getMacIdToFileNameMap, getSearchedDeviceMetadataPaginated, setAlarmToggleValue } from "@/services/deviceservice";
import styles from "@/styles/scss/Home.module.scss";
import PopOver from "@/components/chakrauicomponents/PopOver";
import { AlarmPopUp, ProfilePopUp } from "@/components/customcomponents/AlarmPanel/AlarmPanelContent";
import { getLatestAlarms } from "@/services/alarmservice";
import { useDeviceAlertSocket } from "@/utils/customhooks/useDeviceAlertSocket";
import { SortingState } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import FileUploader from "@/components/customcomponents/FileUploader";
import { Alarm, AlarmResponse, AppState, Device, DeviceFileNameMap, DeviceNameMac, DeviceUpdateMessage, UpdatedFieldsMap } from "@/models/allInterfaces";
import { Button, Input, Popover, Portal, Text } from "@chakra-ui/react"
import * as go from "gojs";
import { useImmer } from "use-immer";
import { ReactDiagramWrapper } from "@/components/customcomponents/ReactDiagramWrapper";
import { formatDateTime, getIcon } from "@/utils/helperfunctions";
import Settings from "@/components/customcomponents/Settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [deviceData, setDeviceData] = useState<Device[]>([]);
  const [state, updateState] = useImmer<AppState>({
    devices: [],
    nodeDataArray: [],
    linkDataArray: [],
    modelData: { canRelink: false },
    skipsDiagramUpdate: false,
    selectedDevice: null
  });
  // const [deviceFileNames, setDeviceFileNames] = useState<DeviceFileNameMap>({});
  const initialTabState = "Health"; // Default active tab
  const [activeTab, setActiveTab] = useState(initialTabState);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState<boolean>(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  // const [currentDeviceFileName, setCurrentDeviceFileName] = useState<string | null>(null);
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState<boolean>(false);
  const [isAlarmPopOverOpen, setIsAlarmPopOverOpen] = useState<boolean>(false);
  const [isProfilePopOverOpen, setIsProfilePopOverOpen] = useState<boolean>(false);
  const [latestAlarms, setLatestAlarms] = useState<Alarm[]>([]);
  const [totalAlarms, setTotalAlarms] = useState<number>(0);
  const [selectedDevicePropertyPanel, setSelectedDevicePropertyPanel] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshDeviceDataKey, setRefreshDeviceDataKey] = useState(0);
  const [hardRefreshDeviceDataKey, setHardRefreshDeviceDataKey] = useState(0);
  const [searchInput, setSearchInput] = useState<any>(null);
  const [updatedFieldsMap, setUpdatedFieldsMap] = useState<UpdatedFieldsMap | null>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [devicesNameMacList, setDevicesNameMacList] = useState<DeviceNameMac[] | null>(null); const [sorting, setSorting] = useState<SortingState>([]);
  const justRefreshedRef = useRef(false);
  const pendingHighlightRef = useRef<UpdatedFieldsMap | null>(null);
  const searchInputTimeoutRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [isDiagramView, setIsDiagramView] = useState(false);
  const diagramRef = useRef<go.Diagram | null>(null);


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

  // Handle incoming SignalR updates for devices top level data
  const handleUpdate = useCallback((msg: string) => {
    const rawDevices: DeviceUpdateMessage[] = JSON.parse(msg);
    console.log("WebSocket update received", rawDevices);

    const isDefaultSorting =
      sorting.length === 0;
    const isSortingOnStatusConnectivityOrLastUpdated =
      sorting.some((s: any) => s.id === "status" || s.id === "connectivity" || s.id === "lastUpdated");

    setDeviceData((prevDevices) => {
      let updatedMacIds: string[] = [];
      let updatedMap: { [macId: string]: string[] } = {};
      let hasChange = false;

      const updatedDevices = prevDevices.map((existingDevice) => {
        const incoming = rawDevices.find((d: any) => d.MacId === existingDevice.macId);
        if (!incoming) return existingDevice;

        const changedFields: string[] = [];
        const updatedDevice = { ...existingDevice };

        if ("Status" in incoming && incoming.Status !== existingDevice.status) {
          updatedDevice.status = incoming.Status!;
          changedFields.push("status");
        }

        if ("Connectivity" in incoming && incoming.Connectivity !== existingDevice.connectivity) {
          updatedDevice.connectivity = incoming.Connectivity!;
          changedFields.push("connectivity");
        }


        if ("LastUpdated" in incoming) {
          updatedDevice.lastUpdated = incoming.LastUpdated!;
        }

        if (changedFields.length > 0) {
          hasChange = true;
          changedFields.push("lastUpdated");
          updatedMacIds.push(existingDevice.macId);
          updatedMap[existingDevice.macId] = changedFields;
          return updatedDevice;
        }

        return existingDevice;
      });

      if (hasChange) {
        console.log("Devices updated:", updatedMacIds);
        // If not on page 1, skip highlight and reordering(commenting this code as of now as suggested changes in demo)
        // if (currentPage !== 1) {
        //   setRefreshDeviceDataKey(prev => prev + 1);
        //   justRefreshedRef.current = true;
        //   return prevDevices;
        // }

        updateState((draft) => {
          // 1️⃣ Update only affected devices
          draft.devices.forEach((device) => {
            if (!updatedMacIds.includes(device.macId)) return;

            const changes = updatedMap[device.macId];
            const updatedDevice = updatedDevices.find((d) => d.macId === device.macId);
            if (!updatedDevice) return;

            if (changes.includes("status")) device.status = updatedDevice.status;
            if (changes.includes("connectivity")) device.connectivity = updatedDevice.connectivity;
            if (changes.includes("lastUpdated")) device.lastUpdated = updatedDevice.lastUpdated;
          });


        });
        if (justRefreshedRef.current) {
          setTimeout(() => {
            setUpdatedFieldsMap(updatedMap);
            highlightTimeoutRef.current = setTimeout(() => setUpdatedFieldsMap(null), 3000);
            justRefreshedRef.current = false;
          }, 100);
        } else {
          setUpdatedFieldsMap(updatedMap);
          if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
          highlightTimeoutRef.current = setTimeout(() => setUpdatedFieldsMap(null), 3000);
        }

        if (isDefaultSorting) {
          const updatedSet = new Set(updatedMacIds);
          const updatedRows = updatedDevices.filter((d) => updatedSet.has(d.macId));
          const restRows = updatedDevices.filter((d) => !updatedSet.has(d.macId));
          return [...updatedRows, ...restRows];
        }

        if (isSortingOnStatusConnectivityOrLastUpdated) {
          pendingHighlightRef.current = updatedMap;
          setRefreshDeviceDataKey(prev => prev + 1);
          justRefreshedRef.current = true;
        }

        return updatedDevices;
      }

      if (currentPage !== 1) {
        setRefreshDeviceDataKey(prev => prev + 1);
        justRefreshedRef.current = true;
        return prevDevices;
      }

      // Handle unseen updates (on page 1 with matching MacId not visible)
      const incomingMacs = new Set(rawDevices.map((d: any) => d.MacId));
      const currentMacs = new Set(prevDevices.map((d) => d.macId));
      const unseenUpdates = [...incomingMacs].filter(mac => !currentMacs.has(mac));

      if (unseenUpdates.length > 0 && currentPage === 1 && (searchInput === "" || searchInput == null)) {
        const unseenMap: { [macId: string]: string[] } = {};
        rawDevices.forEach((d: any) => {
          if (!currentMacs.has(d.MacId)) {
            const fields: string[] = [];
            if ("Status" in d) fields.push("status");
            if ("Connectivity" in d) fields.push("connectivity");
            if ("Connectivity" in d || "Status" in d) fields.push("lastUpdated");
            unseenMap[d.MacId] = fields;
          }
        });

        pendingHighlightRef.current = unseenMap;
        setRefreshDeviceDataKey(prev => prev + 1);
        justRefreshedRef.current = true;
      }

      return prevDevices;
    });

  }, [sorting, currentPage, searchInput]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const handleAlertUpdates = useCallback((msg: string) => {
    const incomingUpdates: AlarmResponse = JSON.parse(msg);

    setLatestAlarms(incomingUpdates.alarms);
    setTotalAlarms(incomingUpdates.totalAlarms);
  }, []);

  // SignalR connection for devices top level data
  useDevicesTopDataSocket(handleUpdate);

  //signalR for alarms data
  useDeviceAlertSocket("sampleDeviceId", handleAlertUpdates, "ReceiveMainPageUpdates");

  // Initial data fetch
  useEffect(() => {
    // const fetchDevicesFileNames = async () => {
    //   const response = await getMacIdToFileNameMap();
    //   if (!response)
    //     console.log("Network response was not ok");

    //   if (response && response.data) {
    //     setDeviceFileNames(response.data);
    //   }
    // };

    const fetchDevicesData = async () => {
      const response = await getDevicesNameMacIdList();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        setDevicesNameMacList(response.data);
      }
    };

    fetchDevicesData();
    // fetchDevicesFileNames();
  }, [hardRefreshDeviceDataKey]);

  useEffect(() => {
    if (pendingHighlightRef.current && deviceData.length > 0) {
      const pendingMap = pendingHighlightRef.current;
      const macIdsInData = new Set(deviceData.map(d => d.macId));

      const validPendingMap: { [macId: string]: string[] } = {};
      Object.entries(pendingMap).forEach(([macId, fields]) => {
        if (macIdsInData.has(macId)) {
          validPendingMap[macId] = fields;
        }
      });

      if (Object.keys(validPendingMap).length > 0) {
        setUpdatedFieldsMap(validPendingMap);

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = setTimeout(() => {
          setUpdatedFieldsMap(null);
        }, 3000);
      }

      pendingHighlightRef.current = null;
    }
  }, [deviceData]);


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
  }, [pageSize, currentPage, refreshDeviceDataKey, sorting, searchInput]);

  useEffect(() => {
    if (searchInput == "" || searchInput == null) {
      return;
    }
    else if (searchInput != null) {
      const fetchSearchedDevicesData = async () => {
        const response = await getSearchedDeviceMetadataPaginated(currentPage, pageSize, searchInput, sorting);
        if (!response)
          console.log("Network response was not ok");

        if (response && response.data) {
          setDeviceData(response.data.data);
          setTotalCount(response.data.totalCount);
        }
      }
      fetchSearchedDevicesData();
    }
  }, [searchInput, sorting, pageSize, currentPage, refreshDeviceDataKey]);

  const changeSearchInput = (value: string) => {
    if (value == null || value == "")
      setSearchInput("");
    if (searchInputTimeoutRef.current)
      clearTimeout(searchInputTimeoutRef.current);

    searchInputTimeoutRef.current = setTimeout(() => {
      setSearchInput(value);
    }, 1000);
  }

  const openPropertypanel = (deviceId: string) => {
    setActiveTab(initialTabState); // Reset to default tab
    setIsPropertyPanelOpen(true);
    // setCurrentDeviceFileName(deviceFileNames[deviceId] || null);
    setCurrentDeviceId(deviceId);

  }

  const closePropertyPanel = () => {
    setIsPropertyPanelOpen(false);
    setCurrentDeviceId(null);
    setSelectedDevicePropertyPanel(null);
    // setCurrentDeviceFileName(null);

    diagramRef.current?.clearSelection();
  }

  const getRefreshedData = async () => {
    const response = await getAllDataRefereshedFromCache(currentPage, pageSize, sorting, searchInput);
    if (!response)
      console.log("Network response was not ok");

    if (response && response.data) {
      setDeviceData(response.data.data);
      setTotalCount(response.data.totalCount);
      setHardRefreshDeviceDataKey(prev => prev + 1); // Trigger hard refresh when data refreshed in backend cache
    }
  };

  function createDiagram(diagram: go.Diagram) {
    const $ = go.GraphObject.make;

    // Basic setup
    diagram.initialContentAlignment = go.Spot.Center;
    diagram.autoScale = go.Diagram.Uniform;
    diagram.contentAlignment = go.Spot.Center;
    diagram.layout = $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 80,
      alignment: go.TreeLayout.AlignmentCenterChildren,
    });

    diagram.toolManager.hoverDelay = 200;

    /* --------------------------- Group Template --------------------------- */
    diagram.groupTemplate = $(
      go.Group,
      "Auto",
      {
        layout: $(go.GridLayout, {
          wrappingColumn: 4,
          cellSize: new go.Size(130, 100),
          spacing: new go.Size(30, 30),
          alignment: go.GridLayout.Position,
        }),
        background: "transparent",
      },
      // Outer rounded rectangle background
      $(
        go.Shape,
        "RoundedRectangle",
        {
          fill: "#f9fafb",
          stroke: "#cbd5e1",
          strokeWidth: 2,
        }
      ),
      // Main vertical stack panel (Title + Placeholder)
      $(
        go.Panel,
        "Vertical",
        { margin: 10 },
        // 🏷️ Group Title
        $(
          go.TextBlock,
          {
            font: "bold 14px Inter, sans-serif",
            stroke: "#334155",
            margin: new go.Margin(5, 0, 10, 0),
            alignment: go.Spot.Center,
            editable: false,
          },
          new go.Binding("text")
        ),
        // Child Nodes Placeholder
        $(go.Placeholder, { padding: 20 })
      )
    );

    /* --------------------------- Server Node --------------------------- */
    diagram.nodeTemplateMap.add(
      "server",
      $(
        go.Node,
        "Auto",
        {
          isShadowed: true,
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.15)"
        },
        $(go.Shape, "RoundedRectangle", {
          fill: "#e2e8f0",
          stroke: "#334155",
          strokeWidth: 2,
        }),
        $(go.TextBlock, {
          margin: 10,
          font: "bold 14px Inter, sans-serif",
          stroke: "#1e293b",
        }, new go.Binding("text", "text"))
      )
    );

    /* --------------------------- Device Node --------------------------- */
    function makeKV(label: string, field: string) {
      return $(
        go.Panel,
        "Horizontal",
        { margin: new go.Margin(2, 0, 0, 0) },
        $(go.TextBlock, label, {
          font: "11px Inter, sans-serif",
          stroke: "#475569",
          margin: new go.Margin(0, 4, 0, 0),
        }),
        $(go.TextBlock, {
          font: "11px Inter, sans-serif",
          stroke: "#334155",
          wrap: go.TextBlock.None,
        }, new go.Binding("text", field))
      );
    }

    diagram.nodeTemplate = $(
      go.Node,
      "Spot",
      { margin: 6, width: 100, height: 88, cursor: "pointer" },
      $(
        go.Panel,
        "Vertical",
        $(go.Shape, "RoundedRectangle",
          {
            fill: "white",
            strokeWidth: 2,
            desiredSize: new go.Size(80, 52),
          },
          new go.Binding("stroke", "status", (s) =>
            s === "Online" ? "#16a34a" : "#dc2626"
          ),
        ),
        $(go.TextBlock, { font: "18px sans-serif", stroke: "#475569" },
          new go.Binding("text", "icon")),
        $(go.TextBlock, {
          font: "11px Inter, sans-serif",
          stroke: "#1e293b",
          margin: 2,
        }, new go.Binding("text", "text"))
      ),

      // Status LED
      $(go.Shape, "Circle", {
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.TopRight,
        desiredSize: new go.Size(12, 12),
        stroke: "#f1f5f9",
        strokeWidth: 1.5,
      }, new go.Binding("fill", "status", (s) =>
        s === "Online" ? "#22c55e" : "#ef4444"
      )),

      // Tooltip
      {
        toolTip: $(
          go.Adornment,
          "Auto",
          $(go.Shape, { fill: "#f9fafb", stroke: "#cbd5e1", strokeWidth: 1 }),
          $(
            go.Panel,
            "Vertical",
            { padding: 8, defaultAlignment: go.Spot.Left },
            $(go.TextBlock, "Device Info", {
              margin: new go.Margin(0, 0, 6, 0),
              font: "bold 12px Inter, sans-serif",
              stroke: "#1e293b",
            }),
            makeKV("Type:", "type"),
            makeKV("MAC:", "macId"),
            makeKV("Connectivity:", "connectivity"),
            makeKV("Last Updated:", "lastUpdated")
          )
        ),
      }
    );

    /* --------------------------- Link Template --------------------------- */
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 5 },
      $(go.Shape, { strokeWidth: 2, stroke: "#475569" }),
      $(go.Shape, { toArrow: "Standard", fill: "#475569" })
    );

    diagramRef.current = diagram;
  }

  const handleModelChange = useCallback((e: any) => {
    // console.log(e);
  }, []);
  
  useEffect(() => {
    const fetchAllDeviceData = async () => {
      const response = await getDeviceMetadata();
      if (!response)
        console.log("Network response was not ok");

      if (response && response.data) {
        updateState(draft => {
          draft.devices = response.data.data;
        });
      }
    };

    fetchAllDeviceData();
  }, []);

  const diagramData = useMemo(() => {
    const nodes: go.ObjectData[] = [
      { key: 0, text: "Monitoring Server", category: "server" },
      { key: 1, text: "Devices", isGroup: true },
      ...state.devices.map((d, i) => ({
        key: d.macId,
        text: d.name,
        status: d.status,
        connectivity: d.connectivity,
        type: d.type,
        macId: d.macId,
        lastUpdated: formatDateTime(d.lastUpdated),
        icon: getIcon(d.type),
        parent: 1,
      })),
    ];
    const links: go.ObjectData[] = [{ from: 0, to: 1 }];
    return { nodes, links };
  }, [state.devices]);

  useEffect(() => {
    console.log(diagramData);

    updateState((draft) => {
      draft.nodeDataArray = diagramData.nodes;
      draft.linkDataArray = diagramData.links;
    });
  }, [diagramData, updateState]);

  const setDeviceView = () => {
    setIsDiagramView(!isDiagramView);
  };

  const downloadDiagram = () => {
    if (diagramRef && diagramRef.current) {
      const diagram = diagramRef.current;
      diagram.commandHandler.downloadSvg({ name: "mySVGfile.svg" });  
    }else{
      alert('Diagram download failed!');
    }
  }

  return (
    <div className={styles.homeContainer}>
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
                  <Badge label={totalAlarms.toString()} bgColor="darkgray" textColor="light" />
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

      <div className={`${styles.subContainer} m-3`}>
        <Sidebar zIndex="zIndex300" openIconMsg={"Open Alarm Panel"} closeIconMsg={"Close Alarm Panel"} position="left" isOpen={isAlarmPanelOpen} setIsOpen={setIsAlarmPanelOpen} >
          {isAlarmPanelOpen && <AlarmPanel devicesNameMacList={devicesNameMacList} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} selectedDevicePropertyPanel={selectedDevicePropertyPanel} />}
        </Sidebar>

        <div>
          <span className={`py-3 ${styles.mainPageTitle}`}>Welcome back, Premal Kadam</span>
          <div className={`py-2 pr-4 ${styles.subNav}`}>
            <input onChange={(event: any) => { changeSearchInput(event.target.value) }} className={styles.mainPageSearchInput} type="search" placeholder="Search..." />
            <div className={styles.mainPageIcons}>
              {isDiagramView &&
              <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">Download diagram</span>}>
                  <Download className={styles.deviceRefreshIcon} onClick={() => { downloadDiagram() }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
                </Tooltip>}
              {(sorting && sorting.length > 0) &&
                <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">Clear sorting</span>}>
                  <ListX className={styles.deviceRefreshIcon} onClick={() => { setSorting([]) }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
                </Tooltip>}
              {deviceData && deviceData.length > 0 &&
                <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">Refresh Device Cache</span>}>
                  <Repeat className={styles.deviceRefreshIcon} onClick={() => { getRefreshedData(); justRefreshedRef.current = true; }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
                </Tooltip>}
              <div>
                <Settings isDiagramView = {isDiagramView} setDeviceView = {setDeviceView} setHardRefreshDeviceDataKey={setHardRefreshDeviceDataKey} setRefreshDeviceDataKey={setRefreshDeviceDataKey}/>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bodyContainer}>
          <div className={`${styles.pageWrapper} ${isPropertyPanelOpen ? styles.pushRight : ''}`}>
            {!isDiagramView ?
              <TableComponent currentDeviceId={currentDeviceId} sorting={sorting} setSorting={setSorting} refreshDeviceDataKey={refreshDeviceDataKey} updatedFieldsMap={updatedFieldsMap} totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} setCurrentPage={setCurrentPage} currentPage={currentPage} data={deviceData} setIsPropertyPanelOpen={openPropertypanel} />
              :
              <ReactDiagramWrapper
                nodeDataArray={state.nodeDataArray}
                linkDataArray={state.linkDataArray}
                modelData={state.modelData}
                skipsDiagramUpdate={state.skipsDiagramUpdate}
                onModelChange={handleModelChange}
                onInitDiagram={createDiagram}
                onDiagramEvent={(e: go.DiagramEvent) => {
                  const name = e.name;
                  console.log(name);
                  
                  switch (name) {
                    case 'ChangedSelection': {
                      const sel = e.subject.first();
                      console.log(sel);

                      if (sel instanceof go.Node) {
                        const data = sel.data;

                        // Example conditions — adjust based on your model
                        if (data?.macId) {
                          console.log('Device node selected:', data);
                          openPropertypanel(data.macId);
                        } else {
                          closePropertyPanel();
                        }
                      } else {
                        closePropertyPanel();
                      }
                      break;
                    }
                    case 'ClipboardPasted': {
                      console.log(e.subject);
                      
                      break;
                    }
                    default:
                      break;
                  }
                }}

              />
            }
          </div>
          {(deviceData && deviceData.length > 0) &&
            <Sidebar zIndex="zIndex200" openIconMsg={"Open Property Panel"} closeIconMsg={"Close Property Panel"} position="right" isOpen={isPropertyPanelOpen} setIsOpen={setIsPropertyPanelOpen} closeSidebar={closePropertyPanel}>
              {isPropertyPanelOpen && <PropertyPanel devicesNameMacList={devicesNameMacList} setCurrentDeviceId={setCurrentDeviceId} setIsAlarmPanelOpen={setIsAlarmPanelOpen} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} activeTab={activeTab} setActiveTab={setActiveTab} currentDeviceId={currentDeviceId} />}
            </Sidebar>}
        </div>
      </div>
    </div>
  );
};
