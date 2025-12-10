// adding comment to test pipeline v2
//comment to test sonarqube ci check v2
//tesing for sonarqube and coverity in pipeline v2
//tesing for generic pipeline pipeline v6
using API.Middleware;
using Application.Dtos;
using Application.Interface;
using Application.Interfaces;
using Infrastructure.Cache;
using Infrastructure.Helpers;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DeviceServiceOptions>(
    builder.Configuration.GetSection("DeviceServiceOptions"));

builder.Services.Configure<DeviceStorageOptions>(
    builder.Configuration.GetSection("DeviceStorageOptions"));

// Add services to the container.

builder.Services.AddControllers();
//builder.Services.AddDbContext<AlarmDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
//);

var dbPath = "C:\\Users\\Premal Kadam\\Documents\\Device Monitoring Project\\DeviceMonitoring\\Backend\\DeviceMonitoring.db";
builder.Services.AddDbContext<DeviceDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath};Cache=Shared;Pooling=True"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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

builder.Services.AddHttpClient();

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

await app.RunAsync();
