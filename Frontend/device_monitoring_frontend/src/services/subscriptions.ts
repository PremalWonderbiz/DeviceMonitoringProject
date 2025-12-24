import { gql } from "@apollo/client";

// ===== Device global updates =====
export const DEVICE_UPDATES_SUB = gql`
  subscription {
    deviceUpdates
  }
`;

// ===== Alarm panel =====
export const ALARM_PANEL_SUB = gql`
  subscription {
    alarmPanelUpdates
  }
`;

// ===== Alarm Updates =====
export const ALARM_UPDATES_SUB = gql`
  subscription {
    alarmUpdates
  }
`;

// ===== Property panel alarms =====
export const PROPERTY_PANEL_ALARM_SUB = gql`
  subscription ($deviceId: String!) {
    propertyPanelAlarmUpdates(deviceId: $deviceId)
  }
`;

// ===== Device detail updates =====
export const DEVICE_DETAIL_SUB = gql`
  subscription ($deviceId: String!) {
    deviceGroupUpdates(deviceId: $deviceId)
  }
`;
