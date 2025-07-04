import React, { useCallback, useEffect, useRef, useState } from "react";
import Accordion from "../Accordion";
import { useDeviceDetailSocket } from "@/utils/customhooks/useDeviceDetailSocket";
import TabList from "./TabList";
import { HealthTabContent, StaticTabContent } from "./PropertyPanelContent";
import { getPropertyPanelData } from "@/services/deviceservice";
import styles from "@/styles/scss/PropertyPanel.module.scss";
import { getChangedPaths } from "@/utils/deepDiff";
import ComboBox from "@/components/chakrauicomponents/ComboBox";


const PropertyPanel = ({ setCurrentDeviceId, setCurrentDeviceFileName, deviceFileNames, devicesNameMacList, setIsAlarmPanelOpen, setSelectedDevicePropertyPanel, currentDeviceId, currentDeviceFileName, activeTab, setActiveTab }: any) => {
    const [PropertyPanelData, setPropertyPanelData] = useState<any>(null);
    const [highlightedPaths, setHighlightedPaths] = useState<string[]>([]);
    const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [shouldConnectSignalR, setShouldConnectSignalR] = useState<boolean>(true);
    const [selectedDevices, setSelectedDevices] = useState<any[]>([]);

    // const handleUpdate = useCallback((msg: any) => {
    //     const incomingDevicesDetails = JSON.parse(msg);
    //     // const newDynamicProps = incomingDevicesDetails;

    //     setPropertyPanelData((prev: any) => {
    //         if (!prev) return prev;

    //         const changed = getChangedPaths(prev.dynamicProperties, incomingDevicesDetails);
    //         setHighlightedPaths(changed);

    //         if (highlightTimeoutRef.current) {
    //             clearTimeout(highlightTimeoutRef.current);
    //         }

    //         highlightTimeoutRef.current = setTimeout(() => {
    //             setHighlightedPaths([]);
    //         }, 3000);

    //         return {
    //             ...prev,
    //             dynamicProperties: incomingDevicesDetails
    //         };
    //     });
    // }, []);



    const handleUpdate = useCallback((msg: any) => {
        const incomingDevicesDetails = JSON.parse(msg);
        console.log(incomingDevicesDetails);
        

        setPropertyPanelData((prev: any) => {
            if (!prev) return prev;

            const merged = {
                ...prev,
                dynamicProperties: deepMerge(prev.dynamicProperties, incomingDevicesDetails)
            };

            const changed = getChangedPaths(prev.dynamicProperties, incomingDevicesDetails);
            setHighlightedPaths(changed);

            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            highlightTimeoutRef.current = setTimeout(() => {
                setHighlightedPaths([]);
            }, 3000);

            return merged;
        });
    }, []);


    function deepMerge(target: any, source: any): any {
        if (Array.isArray(target) && Array.isArray(source)) {
            // Merge arrays element-wise
            return target.map((item, index) => deepMerge(item, source[index] ?? item));
        }

        if (typeof target === "object" && typeof source === "object") {
            const result: any = { ...target };
            for (const key of Object.keys(source)) {
                if (key in target) {
                    result[key] = deepMerge(target[key], source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            return result;
        }

        return source; // For primitives and fallback
    }

    useEffect(() => {
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, []);


    useEffect(() => {
        if (selectedDevices.length == 1) {
            const deviceId = selectedDevices[0].deviceMacId;
            setCurrentDeviceId(deviceId);
            setCurrentDeviceFileName(deviceFileNames[deviceId] || null)
        }
    }, [selectedDevices]);

    useDeviceDetailSocket(currentDeviceId, handleUpdate, shouldConnectSignalR);

    useEffect(() => {
        if (currentDeviceFileName && currentDeviceId) {
            const fetchData = async () => {
                const response = await getPropertyPanelData(currentDeviceFileName);
                if (!response)
                    console.log("Network response was not ok");

                if (response && response.data) {
                    setPropertyPanelData(response.data);
                }
            };
            fetchData();
        }
    }, [currentDeviceId]);

    const changeActiveTab = (tab: any) => {
        tab === "Static" ? setShouldConnectSignalR(false) : setShouldConnectSignalR(true);
        setActiveTab(tab);
    }

    function renderSelectDeviceDropdown() {
        return (
            <div className={styles.selectDeviceDropdown}>
                <span>Select device </span>
                <ComboBox
                    devices={devicesNameMacList}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                    multiple={false}
                />
            </div>
        )
    }

    function renderPropertyPanelData(data: any) {
        if (!data || Object.keys(data).length === 0)
            return renderSelectDeviceDropdown();

        return (
            <div className="pt-2">
                {/* <span className={`pl-2`}>{PropertyPanelData.name} : {PropertyPanelData.type}</span><br /> */}
                <div className={`pl-2 ${styles.propertyPanelHeadingContainer}`}>
                    <span className={styles.deviceTitle}>{PropertyPanelData.name}</span>
                    <span className={styles.deviceSubTitle}>{PropertyPanelData.type}</span>
                </div>
                <div className="mt-2">
                    <Accordion isTabList={true} title={<TabList activeTab={activeTab} setActiveTab={changeActiveTab} />} defaultOpen={true} bgColor=''>
                        {(activeTab === "Static" && PropertyPanelData.staticProperties) ?
                            <StaticTabContent staticProps={PropertyPanelData.staticProperties} />
                            : <HealthTabContent highlightedPaths={highlightedPaths} deviceName={PropertyPanelData.name} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} setIsAlarmPanelOpen={setIsAlarmPanelOpen} deviceMacId={PropertyPanelData.macId} dynamicProps={PropertyPanelData.dynamicProperties} />}
                    </Accordion>
                </div>
            </div>
        );
    }

    return (
        <div className=''>
            {renderPropertyPanelData(PropertyPanelData)}
        </div>
    );
};

export default PropertyPanel;