import {
  GetAlarmsQueryVariables,
  GetLatestAlarmForDeviceQueryVariables,
  getSdk,
  IgnoreAlarmMutationVariables,
  InvestigateAlarmMutationVariables,
  ResolveAlarmMutationVariables,
} from "@/graphql/generated/alarmService";
import { graphqlClient } from "./graphqlClient";

const sdk = getSdk(graphqlClient);

//Rest version
// export const getAlarmPanelData = async (alarmsFilters: any) => {
//   try {
//     const response = await axios.post(`${alarmServiceBaseURL}/api/Alarms/getAlarms`, alarmsFilters);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version
// const buildAlarmFilter = (filters: any) => {
//   return {
//     devices: Array.isArray(filters?.devices) ? filters.devices : [],
//     filterDateRange: Array.isArray(filters?.filterDateRange)
//       ? filters.filterDateRange
//       : [],
//   };
// };

// export const getAlarmPanelData = async (
//   alarmsFilters: any
// ) => {
//   const query = `
//     query ($filter: AlarmFilter!) {
//       alarms(filter: $filter) {
// id
// sourceDeviceMacId
// severity
// message
// raisedAt
// alarmState
// acknowledgedFrom
// isAcknowledged
// acknowledgedAt
// alarmComment
//       }
//     }
//   `;

//   const filter = buildAlarmFilter(alarmsFilters);

//   const data = await graphqlRequest<{ alarms: any[] }>(query, {
//     filter,
//   });

//   const response = {
//     data: data.alarms,
//   }
//   return response;
// };

//GraphQL version using generated sdk
export const getAlarmPanelData = async (
  filter: GetAlarmsQueryVariables["filter"]
) => {
  const data = await sdk.GetAlarms({ filter });
  const response = {
    data: data.alarms,
  };
  return response;
};

//Rest version

// export const getLatestAlarms = async () => {
//   try {
//     const response = await axios.get(`${alarmServiceBaseURL}/api/Alarms/getLatestAlarms`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version
// export const getLatestAlarms = async () => {
//   const query = `
//     query {
//       latestAlarms {
//         totalAlarms
//         alarms {
//           id
//           sourceDeviceMacId
//           severity
//           message
//           raisedAt
//           alarmState
//           acknowledgedFrom
//           isAcknowledged
//           acknowledgedAt
//           alarmComment
//         }
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ latestAlarms: any }>(query);

//   const response = {
//     data: data.latestAlarms,
//   };
//   return response;
// };

//GraphQL version using generated sdk
export const getLatestAlarms = async () => {
  const data = await sdk.GetLatestAlarms();
  const response = {
    data: data.latestAlarms,
  };
  return response;
};

//Rest version
// export const getLatestAlarmForDevice = async (deviceMacId : any) => {
//   try {
//     const response = await axios.get(`${alarmServiceBaseURL}/api/Alarms/getLatestAlarmForDevice/${deviceMacId}`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GRaphQL version
// export const getLatestAlarmForDevice = async (deviceMacId: any) => {
//   const query = `
//     query ($deviceMacId: String!) {
//       latestAlarmForDevice(deviceMacId: $deviceMacId) {
//         totalAlarms
//         alarm {
//           id
//           sourceDeviceMacId
//           severity
//           message
//           raisedAt
//           alarmState
//           acknowledgedFrom
//           isAcknowledged
//           acknowledgedAt
//           alarmComment
//         }
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ latestAlarmForDevice: any }>(query, {
//     deviceMacId,
//   });

//   const response = {
//     data: data.latestAlarmForDevice,
//   };
//   return response;
// };

export const getLatestAlarmForDevice = async (
  deviceMacId: GetLatestAlarmForDeviceQueryVariables["deviceMacId"]
) => {
  const data = await sdk.GetLatestAlarmForDevice({ deviceMacId });
  const response = {
    data: data.latestAlarmForDevice,
  };
  return response;
};

//Rest version
// export const investigateAlarm = async (alarmId: any) => {
//   try {
//     const response = await axios.put(`${alarmServiceBaseURL}/api/Alarms/investigateAlarm/${alarmId}`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version
// export const investigateAlarm = async (alarmId: any) => {
//   const mutation = `
//     mutation ($id: UUID!) {
//       investigateAlarm(id: $id) {
//         id
//         sourceDeviceMacId
//         alarmState
//         isAcknowledged
//         acknowledgedFrom
//         acknowledgedAt
//         severity
//         message
//         raisedAt
//         alarmComment
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ investigateAlarm: any }>(mutation, {
//     id: alarmId,
//   });

//   const response = {
//     data: data.investigateAlarm,
//   };
//   return response;
// };

//GraphQL version using generated sdk
export const investigateAlarm = async (
  id: InvestigateAlarmMutationVariables["id"]
) => {
  const data = await sdk.InvestigateAlarm({ id });
  const response = {
    data: data.investigateAlarm,
  };
  return response;
};

//Rest version
// export const resolveAlarm = async (alarmId: any, input : string) => {
//   const value = (input && input.length > 0) ? input :  "manual";
//   try {
//     const response = await axios.put(`${alarmServiceBaseURL}/api/Alarms/resolveAlarm/${alarmId}/${value}`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version
// export const resolveAlarm = async (alarmId: any, input: string) => {
//   const comment = input && input.length > 0 ? input : "manual";

//   const mutation = `
//     mutation ($id: UUID!, $comment: String!) {
//       resolveAlarm(id: $id, comment: $comment) {
//         id
//         sourceDeviceMacId
//         alarmState
//         isAcknowledged
//         acknowledgedFrom
//         acknowledgedAt
//         severity
//         message
//         raisedAt
//         alarmComment
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ resolveAlarm: any }>(mutation, {
//     id: alarmId,
//     comment,
//   });

//   const response = {
//     data: data.resolveAlarm,
//   };
//   return response;
// };

//GraphQL version using generated sdk
export const resolveAlarm = async (
  id: ResolveAlarmMutationVariables["id"],
  comment: ResolveAlarmMutationVariables["comment"]
) => {
  const data = await sdk.ResolveAlarm({ id, comment });
  const response = {
    data: data.resolveAlarm,
  };
  return response;
};

//Rest version
// export const ignoreAlarm = async (alarmId: any, input : string) => {
//   const value = (input && input.length > 0) ? input :  "manual";
//   try {
//     const response = await axios.delete(`${alarmServiceBaseURL}/api/Alarms/ignoreAlarm/${alarmId}/${value}`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version
// export const ignoreAlarm = async (alarmId: any, input: string) => {
//   const comment = input && input.length > 0 ? input : "manual";

//   const mutation = `
//     mutation ($id: UUID!, $comment: String!) {
//       ignoreAlarm(id: $id, comment: $comment) {
//         id
//         sourceDeviceMacId
//         alarmState
//         isAcknowledged
//         acknowledgedFrom
//         acknowledgedAt
//         severity
//         message
//         raisedAt
//         alarmComment
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ ignoreAlarm: any }>(mutation, {
//     id: alarmId,
//     comment,
//   });

//   const response = {
//     data: data.ignoreAlarm,
//   };
//   return response;
// };

//GraphQL version using generated sdk
export const ignoreAlarm = async (
  id: IgnoreAlarmMutationVariables["id"],
  comment: IgnoreAlarmMutationVariables["comment"]
) => {
  const data = await sdk.IgnoreAlarm({ id, comment });
  const response = {
    data: data.ignoreAlarm,
  };
  return response;
};

//Rest version alarm states
// export const getAlarmStates = async () => {
//   try {
//     const response = await axios.get(`${alarmServiceBaseURL}/api/Alarms/getAlarmStates`);
//     return response;
//   } catch (error : any) {
//      handleAxiosError(error);
//   }
// };

//GraphQL version alarm states
// export const getAlarmStates = async () => {
//   const query = `
//     query {
//       alarmStates {
//         id
//         name
//       }
//     }
//   `;

//   const data = await graphqlRequest<{ alarmStates: any[] }>(query);

//   const response = {
//     data: data.alarmStates,
//   };
//   return response;
// };

export const getAlarmStates = async () => {
  const data = await sdk.GetAlarmStates();
  const response = {
    data: data.alarmStates,
  };
  return response;
};
