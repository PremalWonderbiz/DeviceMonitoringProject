using Application.Dtos;
using HotChocolate.Types;

namespace API.GraphQL.Inputs;

public class AlarmFilterInputType : InputObjectType<AlarmFilter>
{
    protected override void Configure(IInputObjectTypeDescriptor<AlarmFilter> descriptor)
    {
        descriptor.Name("AlarmFilter");

        descriptor.Field(f => f.Devices)
            .Type<ListType<NonNullType<StringType>>>()
            .Description("List of device MAC IDs");

        descriptor.Field(f => f.FilterDateRange)
            .Type<ListType<NonNullType<StringType>>>()
            .Description("Start and end date range");
    }
}
