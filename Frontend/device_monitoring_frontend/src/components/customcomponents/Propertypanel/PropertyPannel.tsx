import React, { useCallback, useEffect, useState } from "react";
import Accordion from "../Accordion";
import { useDeviceDetailSocket } from "@/utils/customhooks/useDeviceDetailSocket";
import TabList from "./TabList";
import { HealthTabContent, StaticTabContent } from "./PropertyPanelContent";
import { getPropertyPanelData } from "@/services/deviceservice";
import styles from "@/styles/scss/PropertyPanel.module.scss";


const PropertyPanel = ({ setIsAlarmPanelOpen, setSelectedDevicePropertyPanel, currentDeviceId, currentDeviceFileName, activeTab, setActiveTab }: any) => {
    const [PropertyPanelData, setPropertyPanelData] = useState<any>(null);

    const handleUpdate = useCallback((msg: any) => {
        const incomingDevicesDetails = JSON.parse(msg);
        setPropertyPanelData((prev: any) => {
            if (!prev) return prev;
            return {
                ...prev,
                dynamicProperties: incomingDevicesDetails.DynamicProperties
            };
        });
    }, []);

    useDeviceDetailSocket(currentDeviceId, handleUpdate);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPropertyPanelData(currentDeviceFileName);
            if (!response)
                console.log("Network response was not ok");

            if (response && response.data) {
                setPropertyPanelData(response.data);
            }
        };
        fetchData();
    }, [currentDeviceId]);

    function renderPropertyPanelData(data: any) {
        if (!data || Object.keys(data).length === 0)
            return <p>No data available.</p>;

        return (
            <>
                <span className={`pl-2`}>{PropertyPanelData.name} : {PropertyPanelData.type}</span><br />
                <div className="mt-2">
                    <Accordion isTabList={true} title={<TabList activeTab={activeTab} setActiveTab={setActiveTab} />} defaultOpen={true} bgColor=''>
                        {(activeTab === "Static Tab" && PropertyPanelData.staticProperties) ?
                            <StaticTabContent staticProps={PropertyPanelData.staticProperties} />
                            : <HealthTabContent deviceName={PropertyPanelData.name} setSelectedDevicePropertyPanel={setSelectedDevicePropertyPanel} setIsAlarmPanelOpen={setIsAlarmPanelOpen} deviceMacId={PropertyPanelData.macId} dynamicProps={PropertyPanelData.dynamicProperties} />}
                    </Accordion>
                </div>
            </>
        );
    }

    return (
        <div className=''>
            {renderPropertyPanelData(PropertyPanelData)}
        </div>
    );
};

export default PropertyPanel;