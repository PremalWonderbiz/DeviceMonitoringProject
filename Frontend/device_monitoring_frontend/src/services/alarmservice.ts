import { handleAxiosError } from "@/utils/helperfunctions";
import { alarmServiceBaseURL } from "@/utils/helpervariables";
import axios from "axios";

export const getAlarmPanelData = async (alarmsFilters: any) => {
  try {    
    const response = await axios.post(`${alarmServiceBaseURL}/api/Alarms/getAlarms`, alarmsFilters);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};

export const getLatestAlarms = async () => {
  try {
    const response = await axios.get(`${alarmServiceBaseURL}/api/Alarms/getLatestAlarms`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};

export const getLatestAlarmForDevice = async (deviceMacId : any) => {
  try {
    const response = await axios.get(`${alarmServiceBaseURL}/api/Alarms/getLatestAlarmForDevice/${deviceMacId}`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};

export const acknowledgeAlarm = async (alarmId: any) => {
  try {
    const response = await axios.put(`${alarmServiceBaseURL}/api/Alarms/acknowledgeAlarm/${alarmId}`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};