using HotChocolate;
using HotChocolate.Subscriptions;

namespace API.GraphQL
{
    using HotChocolate;
    using HotChocolate.Subscriptions;

    public class Subscription
    {
        [Subscribe]
        [Topic("DeviceGroupUpdates_{deviceId}")]
        public string DeviceGroupUpdates(
            string deviceId,
            [EventMessage] string payload)
            => payload;

        [Subscribe]
        [Topic("PropertyPanelAlarmUpdates_{deviceId}")]
        public string PropertyPanelAlarmUpdates(
            string deviceId,
            [EventMessage] string payload)
            => payload;

        [Subscribe]
        [Topic("AlarmPanelUpdates")]
        public string AlarmPanelUpdates([EventMessage] string payload)
            => payload;

        [Subscribe]
        [Topic("DeviceUpdates")]
        public string DeviceUpdates([EventMessage] string payload)
            => payload;

        [Subscribe]
        [Topic("AlarmUpdates")]
        public string AlarmUpdates([EventMessage] string payload)
            => payload;
    }

}
