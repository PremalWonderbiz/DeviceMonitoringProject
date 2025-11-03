# Device Monitoring System

A comprehensive full-stack real-time device monitoring solution built with .NET microservices backend, Next.js frontend, and interactive architecture visualization.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)
![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)
![SignalR](https://img.shields.io/badge/SignalR-WebSocket-512BD4?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Projects](#projects)
- [Technology Stack](#technology-stack)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Device Monitoring System is a modern, scalable solution for real-time device monitoring and alerting. Built with microservices architecture, it provides:

- **Real-time device monitoring** with configurable data sources
- **Intelligent alarm system** with rule-based threshold evaluation
- **Centralized event streaming** through WebSocket gateway
- **Interactive web interface** with live updates
- **Flexible data persistence** with SQLite and JSON support
- **Visual architecture documentation** with interactive diagrams

### 🌐 Live Demo

**[View Interactive Architecture Visualization →](https://device-monitoring-project.vercel.app/)**

Explore the system architecture with our interactive GoJS-powered diagram deployed on Vercel.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Application (Pages Router)                      │  │
│  │  • SignalR Client • TanStack Table • Chakra UI/RSuite   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ WebSocket (SignalR)
┌────────────────────────┴────────────────────────────────────────┐
│                     Backend Services                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ Gateway Service │  │ Device Monitor  │  │ Alarm Service  │ │
│  │ • WebSocket Hub │  │ • Data Loading  │  │ • Rules Engine │ │
│  │ • Event Router  │  │ • Bg Updates    │  │ • Alert Mgmt   │ │
│  └─────────────────┘  └─────────────────┘  └────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                        Data Layer                               │
│  ┌──────────────────┐           ┌──────────────────────────┐   │
│  │ SQLite Database  │           │ JSON Files (Optional)    │   │
│  │ • EF Core        │           │ • Device Data            │   │
│  │ • Alarm Rules    │           │ • Fallback Source        │   │
│  │ • Device Data    │           └──────────────────────────┘   │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

### System Components

#### Backend Services (.NET 8)

1. **Device Monitoring Service**
   - Manages device data from SQLite or JSON files (configurable via AppSettings)
   - Periodic background updates for device states
   - Emits live device updates to Gateway and Alarm services
   - RESTful API for device management

2. **Alarm Service**
   - Receives real-time device updates from Device Monitoring Service
   - Evaluates device metrics against predefined threshold rules
   - Generates and persists alarms to SQLite database
   - Triggers alarm notifications to Gateway Service
   - Manages alarm rules and history

3. **Gateway Service**
   - Central SignalR WebSocket hub for real-time communication
   - Aggregates events from all backend services
   - Routes live updates to connected frontend clients
   - Single connection point for frontend (simplified architecture)

#### Frontend (Next.js)

- **Main Application**
  - React-based UI with Next.js Pages Router
  - SignalR integration for real-time updates
  - TanStack Table for efficient data rendering
  - Chakra UI and RSuite component libraries
  - SCSS modules for styling

#### Data Layer

- **SQLite Database**
  - Entity Framework Core integration
  - Stores alarm rules, alarm history, and device data
  - Configurable as primary data source

- **JSON Files**
  - Alternative device data source
  - Useful for testing and development
  - Switchable via AppSettings configuration

#### Visualization (Next.js + GoJS)

- **Architecture Diagram Tool**
  - Interactive system architecture visualization
  - Built with GoJS React for professional diagrams
  - Shows real-time data flow and component relationships
  - Separate Next.js application for documentation

## ✨ Features

### Real-time Monitoring
- ⚡ Live device status updates via WebSocket
- 📊 Dynamic data visualization with TanStack Table
- 🔄 Automatic background data refresh
- 📱 Responsive design for desktop and mobile

### Intelligent Alerting
- 🚨 Rule-based threshold evaluation
- 🎯 Configurable alarm rules per device
- 📝 Alarm history and audit trail
- 🔔 Real-time alarm notifications

### Flexible Configuration
- ⚙️ Switchable data sources (SQLite/JSON)
- 🔧 AppSettings-based configuration
- 📦 Easy deployment and setup
- 🔐 Secure and scalable architecture

### Developer Tools
- 📐 Interactive architecture diagrams
- 📚 Comprehensive documentation
- 🧪 Easy testing with JSON fallback
- 🔍 Clear separation of concerns

## 📁 Project Structure

```
device-monitoring-system/
├── backend/
│   ├── DeviceMonitoringService/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   ├── Data/
│   │   │   ├── DbContext/
│   │   │   └── JsonFiles/
│   │   ├── BackgroundServices/
│   │   └── appsettings.json
│   │
│   ├── AlarmService/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   │   ├── AlarmEvaluationService.cs
│   │   │   └── RuleEngineService.cs
│   │   ├── Models/
│   │   │   ├── Alarm.cs
│   │   │   └── AlarmRule.cs
│   │   ├── Data/
│   │   └── appsettings.json
│   │
│   └── GatewayService/
│       ├── Hubs/
│       │   └── EventHub.cs
│       ├── Services/
│       ├── Models/
│       └── appsettings.json
│
├── frontend/
│   ├── device-monitoring-ui/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── _app.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── devices/
│   │   │   │   └── alarms/
│   │   │   ├── components/
│   │   │   │   ├── DeviceTable/
│   │   │   │   ├── AlarmPanel/
│   │   │   │   └── common/
│   │   │   ├── services/
│   │   │   │   ├── signalRService.ts
│   │   │   │   └── apiService.ts
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   │   ├── globals.scss
│   │   │   │   └── components/
│   │   │   └── utils/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── device-monitoring-viz/
│       ├── src/
│       │   ├── components/
│       │   │   └── diagrams/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       └── package.json
│
├── database/
│   ├── migrations/
│   ├── DeviceMonitoring.db
│   └── seed-data.sql
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── development/
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

## 📦 Prerequisites

### Development Environment

- **.NET SDK**: 8.0 or higher
- **Node.js**: 16.x or higher
- **npm/yarn**: Latest version
- **SQLite**: 3.x (included with .NET)
- **Git**: For version control

### Optional Tools

- **Visual Studio 2022** or **VS Code** with C# extension
- **Postman** or similar for API testing
- **Docker** (for containerized deployment)

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/device-monitoring-system.git
   cd device-monitoring-system
   ```

2. **Setup Backend Services**
   ```bash
   cd backend/DeviceMonitoringService
   dotnet restore
   dotnet ef database update
   dotnet run
   
   # In separate terminals, start other services
   cd ../AlarmService
   dotnet run
   
   cd ../GatewayService
   dotnet run
   ```

3. **Setup Frontend**
   ```bash
   cd frontend/device-monitoring-ui
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Main UI: http://localhost:3000
   - Device Service API: http://localhost:5001
   - Alarm Service API: http://localhost:5002
   - Gateway Service: http://localhost:5003

### Configuration

#### Backend Configuration

Edit `appsettings.json` in each service:

**DeviceMonitoringService/appsettings.json**
```json
{
  "DataSource": {
    "UseDatabase": true,        // true for SQLite, false for JSON
    "ConnectionString": "Data Source=../../../database/DeviceMonitoring.db",
    "JsonFilePath": "./Data/JsonFiles/devices.json"
  },
  "BackgroundService": {
    "UpdateIntervalSeconds": 30
  },
  "GatewayService": {
    "Url": "http://localhost:5003"
  }
}
```

**AlarmService/appsettings.json**
```json
{
  "ConnectionString": "Data Source=../../../database/DeviceMonitoring.db",
  "ThresholdRules": {
    "Temperature": {
      "Min": 0,
      "Max": 100
    },
    "Pressure": {
      "Min": 0,
      "Max": 500
    }
  },
  "GatewayService": {
    "Url": "http://localhost:5003"
  }
}
```

**GatewayService/appsettings.json**
```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  },
  "SignalR": {
    "EnableDetailedErrors": true
  }
}
```

#### Frontend Configuration

Create `.env.local` in `frontend/device-monitoring-ui`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GATEWAY_URL=http://localhost:5003
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

## 🎯 Projects

### 1. Device Monitoring Service
**Location:** `backend/DeviceMonitoringService`

**Purpose:** Core service for managing and monitoring device data.

**Key Features:**
- Configurable data source (SQLite/JSON)
- Background data updates
- RESTful API endpoints
- Real-time data emission

**Endpoints:**
- `GET /api/devices` - Get all devices
- `GET /api/devices/{id}` - Get device by ID
- `POST /api/devices` - Create new device
- `PUT /api/devices/{id}` - Update device
- `DELETE /api/devices/{id}` - Delete device

### 2. Alarm Service
**Location:** `backend/AlarmService`

**Purpose:** Intelligent alarm evaluation and management.

**Key Features:**
- Rule-based threshold evaluation
- Real-time device monitoring
- Alarm persistence and history
- Configurable alarm rules

**Endpoints:**
- `GET /api/alarms` - Get all alarms
- `GET /api/alarms/{id}` - Get alarm by ID
- `GET /api/alarms/active` - Get active alarms
- `POST /api/alarms/rules` - Create alarm rule
- `PUT /api/alarms/{id}/acknowledge` - Acknowledge alarm

### 3. Gateway Service
**Location:** `backend/GatewayService`

**Purpose:** Central hub for real-time communication.

**Key Features:**
- SignalR WebSocket hub
- Event aggregation from services
- Real-time broadcasting to clients

**SignalR Hub Methods:**
- `SubscribeToDeviceUpdates()`
- `SubscribeToAlarms()`
- `UnsubscribeFromDeviceUpdates()`
- `UnsubscribeFromAlarms()`

### 4. Main Frontend Application
**Location:** `frontend/device-monitoring-ui`

**Purpose:** Primary user interface for monitoring and management.

**Key Features:**
- Real-time device dashboard
- Alarm management panel
- Device configuration
- Historical data views

**Tech Stack:**
- Next.js (Pages Router)
- TypeScript
- SignalR Client
- TanStack Table
- Chakra UI / RSuite
- SCSS Modules

### 5. Architecture Visualization
**Location:** `frontend/device-monitoring-viz`

**Purpose:** Interactive system architecture documentation.

**Key Features:**
- GoJS-powered diagrams
- Interactive node exploration
- Professional visualization
- Export capabilities

**See:** [Visualization README](frontend/device-monitoring-viz/README.md)

## 🛠️ Technology Stack

### Backend
- **.NET 8.0** - Framework
- **ASP.NET Core** - Web API
- **Entity Framework Core** - ORM
- **SignalR** - Real-time communication
- **SQLite** - Database
- **Serilog** - Logging

### Frontend
- **Next.js 13+** - React framework
- **TypeScript** - Type safety
- **SignalR Client** - WebSocket connection
- **TanStack Table** - Data tables
- **Chakra UI** - Component library
- **RSuite** - UI components
- **SCSS Modules** - Styling
- **GoJS React** - Diagramming (visualization project)

### DevOps
- **Git** - Version control
- **Docker** - Containerization
- **GitHub Actions** - CI/CD (optional)

## ⚙️ Configuration

### Data Source Configuration

Toggle between SQLite and JSON data sources in `appsettings.json`:

```json
{
  "DataSource": {
    "UseDatabase": true  // Set to false to use JSON files
  }
}
```

### Connection Strings

**SQLite (Recommended for Production):**
```json
{
  "ConnectionString": "Data Source=./DeviceMonitoring.db"
}
```

**JSON Files (Development/Testing):**
```json
{
  "JsonFilePath": "./Data/JsonFiles/devices.json"
}
```

### CORS Configuration

Configure allowed origins in `GatewayService/appsettings.json`:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ]
  }
}
```

## 💻 Development

### Running All Services

**Option 1: Manual (Separate Terminals)**
```bash
# Terminal 1 - Device Service
cd backend/DeviceMonitoringService
dotnet run

# Terminal 2 - Alarm Service
cd backend/AlarmService
dotnet run

# Terminal 3 - Gateway Service
cd backend/GatewayService
dotnet run

# Terminal 4 - Frontend
cd frontend/device-monitoring-ui
npm run dev
```

**Option 2: Docker Compose**
```bash
docker-compose up
```

### Database Migrations

```bash
cd backend/DeviceMonitoringService
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Code Generation

Generate API client for frontend:
```bash
cd frontend/device-monitoring-ui
npm run generate-api-client
```

### Testing

**Backend Tests:**
```bash
cd backend/DeviceMonitoringService.Tests
dotnet test
```

**Frontend Tests:**
```bash
cd frontend/device-monitoring-ui
npm test
```

## 🚢 Deployment

### Production Build

**Backend:**
```bash
cd backend/DeviceMonitoringService
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd frontend/device-monitoring-ui
npm run build
npm start
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

**Production Backend:**
```bash
export ASPNETCORE_ENVIRONMENT=Production
export ConnectionStrings__DefaultConnection="Data Source=/data/DeviceMonitoring.db"
```

**Production Frontend:**
```bash
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com
export NEXT_PUBLIC_GATEWAY_URL=https://gateway.yourdomain.com
```

## 📚 API Documentation

### Swagger UI

Access interactive API documentation:
- Device Service: http://localhost:5001/swagger
- Alarm Service: http://localhost:5002/swagger
- Gateway Service: http://localhost:5003/swagger

### API Examples

**Get All Devices:**
```bash
curl http://localhost:5001/api/devices
```

**Create Alarm Rule:**
```bash
curl -X POST http://localhost:5002/api/alarms/rules \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device-001",
    "parameter": "temperature",
    "threshold": 80,
    "operator": "GreaterThan"
  }'
```

**SignalR Connection (JavaScript):**
```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5003/eventHub")
  .build();

connection.on("DeviceUpdate", (data) => {
  console.log("Device updated:", data);
});

await connection.start();
await connection.invoke("SubscribeToDeviceUpdates");
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- **Backend:** Follow C# coding conventions and use async/await
- **Frontend:** Use TypeScript, follow ESLint rules
- **Commits:** Use conventional commit messages
- **Documentation:** Update README and code comments


## 🙏 Acknowledgments

- .NET Team for the amazing framework
- Next.js team for the incredible React framework
- GoJS for powerful diagramming capabilities
- SignalR for real-time communication
- Open source community


## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
