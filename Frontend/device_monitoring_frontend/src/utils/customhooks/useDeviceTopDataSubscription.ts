import { useEffect, useRef } from "react";
import { useSubscription } from "@apollo/client/react";
import { DEVICE_UPDATES_SUB } from "@/services/subscriptions";


// Types
interface DeviceUpdatesResult {
  deviceUpdates: string;
}

/* ================================
   Hook
================================ */

export function useDevicesTopDataSubscription(
  onUpdate: (data: any) => void
) {
  const onUpdateRef = useRef(onUpdate);

  // keep latest callback without resubscribing
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const { data } = useSubscription<DeviceUpdatesResult>(
    DEVICE_UPDATES_SUB
  );

  useEffect(() => {
    if (data?.deviceUpdates !== undefined) {
      onUpdateRef.current?.(data.deviceUpdates);
    }
  }, [data]);
}
