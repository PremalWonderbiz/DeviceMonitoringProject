using Application.Dtos;
using HotChocolate.Types;

namespace API.GraphQL.Types;

public class LatestAlarmsType : ObjectType<GetLatestAlarmsDto>
{
    protected override void Configure(IObjectTypeDescriptor<GetLatestAlarmsDto> descriptor)
    {
        descriptor.Name("LatestAlarms");

        descriptor.Field(f => f.TotalAlarms)
            .Type<NonNullType<IntType>>()
            .Description("Total number of alarms in the system");

        descriptor.Field(f => f.Alarms)
            .Type<NonNullType<ListType<NonNullType<AlarmType>>>>()
            .Description("Most recent alarms");
    }
}
