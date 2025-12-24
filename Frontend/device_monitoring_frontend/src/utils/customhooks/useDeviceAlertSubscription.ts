import { useEffect } from "react";
import { useSubscription } from "@apollo/client/react";
import {
  ALARM_PANEL_SUB,
  ALARM_UPDATES_SUB,
  PROPERTY_PANEL_ALARM_SUB,
} from "@/services/subscriptions";

/* ================================
   Typed subscription results
================================ */

interface AlarmPanelUpdatesResult {
  alarmPanelUpdates: string;
}

interface PropertyPanelAlarmUpdatesResult {
  propertyPanelAlarmUpdates: string;
}

interface AlarmUpdatesResult {
  alarmUpdates: string;
}

interface DeviceIdVariables {
  deviceId: string;
}

/* ================================
   Hook
================================ */

export const useDeviceAlertSubscription = (
  deviceId: string | null,
  onMessage: (msg: string) => void,
  type: "alarmPanel" | "propertyPanel" | "mainPage",
  shouldConnect : boolean = true
) => {  
  // Alarm panel subscription (no variables)
  const alarmPanelSub = useSubscription<AlarmPanelUpdatesResult>(
    ALARM_PANEL_SUB,
    {
      skip: type !== "alarmPanel" || !shouldConnect,
    }
  );

  const mainPageSub = useSubscription<AlarmUpdatesResult>(
    ALARM_UPDATES_SUB,
    {
      skip: type !== "mainPage" || !shouldConnect,
    }
  );
  
  // Property panel subscription (requires deviceId)
  const propertyPanelSub = useSubscription<
    PropertyPanelAlarmUpdatesResult,
    DeviceIdVariables
  >(PROPERTY_PANEL_ALARM_SUB, {
    variables: { deviceId: deviceId ?? "" }, // ✅ always present
    skip: type !== "propertyPanel" || !deviceId || !shouldConnect,
  });

  useEffect(() => {
    if (type === "alarmPanel") {
      const payload = alarmPanelSub.data?.alarmPanelUpdates;
      if (payload !== undefined) {
        onMessage(payload);
      }
    }

    if (type === "propertyPanel") {
      const payload =
        propertyPanelSub.data?.propertyPanelAlarmUpdates;
      if (payload !== undefined) {
        onMessage(payload);
      }
    }

    if (type === "mainPage") {
      const mainPayload = mainPageSub.data?.alarmUpdates;
      if (mainPayload !== undefined) {
        onMessage(mainPayload);
      }
    }
  }, [
    type,
    alarmPanelSub.data,
    propertyPanelSub.data,
    mainPageSub.data,
    onMessage
  ]);

  // Handle subscription cleanup when shouldConnect changes
  useEffect(() => {
    if (!shouldConnect) {
      // Unsubscribe when shouldConnect is false
      console.log("Disconnecting subscriptions");
    } else {
      // Reconnect when shouldConnect becomes true
      console.log("Reconnecting subscriptions");
    }
    // Subscriptions automatically unsubscribe when skip=true and reconnect when skip=false
  }, [shouldConnect]);
};
