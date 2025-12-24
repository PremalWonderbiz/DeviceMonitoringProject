using Application.Dtos;
using HotChocolate.Types;

namespace API.GraphQL.Types;

public class AlarmStateType : ObjectType<GetAlarmStatesDto>
{
    protected override void Configure(IObjectTypeDescriptor<GetAlarmStatesDto> descriptor)
    {
        descriptor.Name("AlarmState");

        descriptor.Field(f => f.Id)
            .Type<NonNullType<IntType>>();

        descriptor.Field(f => f.Name)
            .Type<NonNullType<StringType>>();
    }
}
