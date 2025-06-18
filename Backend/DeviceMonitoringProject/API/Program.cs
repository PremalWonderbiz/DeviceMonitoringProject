using Application.Dtos;
using Application.Interfaces;
using Infrastructure.Helpers;
using Infrastructure.RealTime;
using Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DeviceServiceOptions>(
    builder.Configuration.GetSection("DeviceServiceOptions"));


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddHostedService<DeviceLiveDataBgService>();
builder.Services.AddTransient<IDeviceService, DeviceService>();
builder.Services.AddTransient<IDynamicDataHelper, DynamicDataHelper>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy => policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

app.MapHub<DeviceHub>("/devicehub");

app.Run();
