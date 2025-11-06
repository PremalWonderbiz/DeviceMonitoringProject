import { Popover, Portal, Separator, Text } from "@chakra-ui/react"
import { Tooltip } from "../ui/tooltip";
import { Menu } from "lucide-react";
import styles from "@/styles/scss/Home.module.scss";
import { getAlarmToggleValue, setAlarmToggleValue } from "@/services/deviceservice";
import { useEffect, useState } from "react";
import SwitchComponent from "../chakrauicomponents/SwitchComponent";
import FileUploader from "./FileUploader";

const Settings = (props: any) => {

    const [simulateAlarms, setSimulateAlarms] = useState(false);

    useEffect(() => {
        const fetchAlarmToggleStatus = async () => {
            const response = await getAlarmToggleValue();
            if (!response)
                console.log("Network response was not ok");

            if (response && response.data) {
                console.log(response.data, typeof response.data);

                setSimulateAlarms(response.data.alarmEnabled);
            }
        };
        fetchAlarmToggleStatus();
    }, []);

    const toggleAlarmSimulation = () => {
        const setAlarmToggleStatus = async () => {
            const response = await setAlarmToggleValue(!simulateAlarms);
            if (!response)
                console.log("Network response was not ok");

            if (response && response.data) {
                setSimulateAlarms(response.data.alarmEnabled);
            }
        };
        setAlarmToggleStatus();
    };

    return (
        <Popover.Root positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger asChild>
                <div >
                    <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">Settings</span>}>
                        <Menu className={styles.deviceRefreshIcon} onClick={() => { }} strokeWidth={"2.5px"} size={25} cursor={"pointer"} />
                    </Tooltip>
                </div>
            </Popover.Trigger>

            <Portal>
                <Popover.Positioner>
                    <Popover.Content style={{ width: "100%" }}>
                        <Popover.Body>
                            <div style={{ padding: "0.5rem 0.8rem" }}>
                                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                                    <tbody>
                                        <tr style={{ borderBottom: "0.8rem solid transparent" }}>
                                            <td style={{ paddingRight: "0.5rem" }}>
                                                <Text textStyle="sm">
                                                    Simulate Alarms
                                                </Text>
                                            </td>
                                            <td>
                                                <SwitchComponent tooltip={`${simulateAlarms ? 'Stop Alarms' : 'Start Alarms'}`} enabled={simulateAlarms} toggle={toggleAlarmSimulation} />
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: "0.8rem solid transparent" }}>
                                            <td style={{ paddingRight: "0.5rem" }}>
                                                <Text textStyle="sm">
                                                    {!props.isDiagramView ? 'Toggle Diagram View' : 'Toggle Table View'}
                                                </Text>
                                            </td>
                                            <td>
                                                <SwitchComponent tooltip={`Toggle View`} enabled={props.isDiagramView} toggle={props.setDeviceView} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Separator />
                                <div style={{marginTop:"0.8rem"}}>
                                <FileUploader setHardRefreshDeviceDataKey={props.setHardRefreshDeviceDataKey} setRefreshDeviceDataKey={props.setRefreshDeviceDataKey} />
                                </div>
                            </div>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
export default Settings;