using API.Middleware;
using Application.Dtos;
using Application.Interface;
using Application.Interfaces;
using Infrastructure.Cache;
using Infrastructure.Helpers;
using Infrastructure.RealTime;
using Infrastructure.Services;
using Microsoft.Extensions.Options;

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
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IDynamicDataHelper, DynamicDataHelper>();
builder.Services.AddScoped<IDeviceServiceHelper, DeviceServiceHelper>();
builder.Services.AddScoped<IAlarmEvaluationService, AlarmEvaluationService>();
builder.Services.AddHttpClient<IAlarmEvaluationService, AlarmEvaluationService>(client =>
{
    //local
    client.BaseAddress = new Uri("https://localhost:7154");
    //docker
    //client.BaseAddress = new Uri("http://alarmservice:7154"); // later configure it in appsettings
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy => policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials());
});

//cache register
builder.Services.AddSingleton<DeviceStateCache>();
builder.Services.AddSingleton<IAlarmToggleService, AlarmToggleService>();
builder.Services.AddHostedService<DeviceStatePersistenceService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

app.MapHub<DeviceHub>("/devicehub");

app.Run();
