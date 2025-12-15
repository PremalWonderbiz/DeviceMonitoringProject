// adding comment to test pipeline v2
//comment for testing branch rules for pr
//comment to test sonarqube ci check v2
//tesing for sonarqube and coverity in pipeline v2
//tesing for generic pipeline pipeline v28
using API.Middleware;
using Application.Interface;
using Domain.Interface;
using Infrastructure.Persistence;
using Infrastructure.RealTime;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IAlarmService, AlarmService>();
builder.Services.AddScoped<IAlarmEvaluationService, AlarmEvaluationService>();
builder.Services.AddScoped<AlertService>();

//builder.Services.AddDbContext<AlarmDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
//);

var dbPath = "C:\\Users\\Premal Kadam\\Documents\\Device Monitoring Project\\DeviceMonitoring\\Backend\\DeviceMonitoring.db";
builder.Services.AddDbContext<AlarmDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy => policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<AlertService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AlarmDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

app.Run();
