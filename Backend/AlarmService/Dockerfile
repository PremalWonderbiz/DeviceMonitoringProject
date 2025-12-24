# ==========================
# Build stage
# ==========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files first
COPY Backend/AlarmService ./Backend/AlarmService
RUN dotnet restore Backend/AlarmService/API/API.csproj

# Publish API project ONLY
RUN dotnet publish Backend/AlarmService/API/API.csproj \
    -c Release \
    -o /app/publish

# ==========================
# Runtime stage
# ==========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN mkdir -p /data

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
