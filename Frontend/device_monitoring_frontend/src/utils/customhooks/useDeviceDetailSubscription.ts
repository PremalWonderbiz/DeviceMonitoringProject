import {
  DeviceDetailUpdatesSubscription,
  DeviceDetailUpdatesSubscriptionVariables,
} from "@/graphql/generated/gatewayservice";
import { DEVICE_DETAIL_SUB } from "@/services/apolloSubscriptions";
import { useSubscription } from "@apollo/client/react";
import { useEffect } from "react";

export const useDeviceDetailSubscription = (
  deviceId: string | null,
  onMessage: (msg: string) => void,
  enabled = true
) => {
  const { data } = useSubscription<
    DeviceDetailUpdatesSubscription,
    DeviceDetailUpdatesSubscriptionVariables
  >(DEVICE_DETAIL_SUB, {
    variables: {
      deviceId: deviceId ?? "", // always present
    },
    skip: !enabled || !deviceId, // prevents execution
  });

  useEffect(() => {
    if (data?.deviceGroupUpdates) {
      onMessage(data.deviceGroupUpdates);
    }
  }, [data]);
};
