import { useEffect } from "react";
import { useSubscription } from "@apollo/client/react";
import { DEVICE_DETAIL_SUB } from "@/services/subscriptions";
import {
  DeviceGroupUpdatesResult,
  DeviceGroupUpdatesVariables
} from "@/models/graphqlSubscriptions";

export const useDeviceDetailSubscription = (
  deviceId: string | null,
  onMessage: (msg: string) => void,
  enabled = true
) => {
  const { data } = useSubscription<
    DeviceGroupUpdatesResult,
    DeviceGroupUpdatesVariables
  >(DEVICE_DETAIL_SUB, {
    variables: {
      deviceId: deviceId ?? "",   // ✅ always present
    },
    skip: !enabled || !deviceId,  // ✅ prevents execution
  });

  useEffect(() => {
    if (data?.deviceGroupUpdates) {
      onMessage(data.deviceGroupUpdates);
    }
  }, [data]);
};
