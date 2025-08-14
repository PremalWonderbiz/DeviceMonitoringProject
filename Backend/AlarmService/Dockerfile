# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install tzdata to set time zone
RUN apt-get update && apt-get install -y tzdata

# Set time zone to Asia/Kolkata (for IST)
ENV TZ=Asia/Kolkata

# Copy the entire code
COPY . .

RUN dotnet restore ./AlarmService.sln
RUN dotnet publish ./API/API.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:7154
EXPOSE 7154

ENTRYPOINT ["dotnet", "API.dll"]
