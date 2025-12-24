using Application.Dtos;
using HotChocolate.Types;

namespace API.GraphQL.Types;

public class LatestAlarmForDeviceType : ObjectType<GetLatestAlarmForDeviceDto>
{
    protected override void Configure(IObjectTypeDescriptor<GetLatestAlarmForDeviceDto> descriptor)
    {
        descriptor.Name("LatestAlarmForDevice");

        descriptor.Field(f => f.TotalAlarms)
            .Type<NonNullType<IntType>>()
            .Description("Total alarms raised for the device");

        descriptor.Field(f => f.Alarm)
            .Type<AlarmType>()
            .Description("Most recent alarm for the device");
    }
}
