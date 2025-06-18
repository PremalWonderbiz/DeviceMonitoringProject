import { handleAxiosError } from "@/utils/helperfunctions";
import { baseURL } from "@/utils/helpervariables";
import axios from "axios";

//get property panel data for a device
export const getPropertyPanelData = async (currentDeviceFileName: any) => {
  try {
    const response = await axios.get(`${baseURL}/api/Devices/getPropertyPanelData/${currentDeviceFileName}`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};

export const getDevicesTopLevelData = async (pageNo : any, pageSize : any) => {
  try {
    const response = await axios.get(`${baseURL}/api/Devices/metadata/${pageNo}/${pageSize}`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};

export const getMacIdToFileNameMap = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/Devices/getMacIdToFileNameMap`);
    return response;
  } catch (error : any) {
     handleAxiosError(error);
  }
};