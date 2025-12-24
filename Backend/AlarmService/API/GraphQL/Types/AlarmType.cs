using Application.Dtos;
using HotChocolate.Types;

namespace API.GraphQL.Types;

//Not using currently
public class AlarmType : ObjectType<GetAlarmDto>
{
    protected override void Configure(IObjectTypeDescriptor<GetAlarmDto> descriptor)
    {
        descriptor.Name("Alarm");

        descriptor.Field(a => a.Id).Type<NonNullType<UuidType>>();
        descriptor.Field(a => a.SourceDeviceMacId).Type<NonNullType<StringType>>();
        descriptor.Field(a => a.Severity).Type<NonNullType<StringType>>();
        descriptor.Field(a => a.Message).Type<NonNullType<StringType>>();
        descriptor.Field(a => a.RaisedAt).Type<NonNullType<DateTimeType>>();
        descriptor.Field(a => a.AlarmState).Type<NonNullType<StringType>>();

        descriptor.Field(a => a.AcknowledgedFrom)
            .Type<StringType>()        // ← nullable
            .Description("User or system that acknowledged the alarm");

        descriptor.Field(a => a.AcknowledgedAt)
            .Type<DateTimeType>();     // nullable

        descriptor.Field(a => a.AlarmComment)
            .Type<StringType>();       // nullable
    }
}
