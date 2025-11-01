# Device Monitoring System - Architecture Visualization

A professional Next.js application built with GoJS React to visualize the Device Monitoring System's microservices architecture, data flow, and real-time event streaming.

![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)
![GoJS](https://img.shields.io/badge/GoJS-2.3+-00ADD8?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC?style=flat-square&logo=tailwind-css)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Configuration](#configuration)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project provides an interactive visual representation of the Device Monitoring System architecture, showcasing:

- **Backend Services**: Device Monitoring, Alarm Service, and Gateway Service
- **Frontend Layer**: Next.js application with real-time updates
- **Data Sources**: SQLite database and JSON files with configurable loading
- **Data Flow**: Real-time event streaming and WebSocket communication

## ✨ Features

- 🎨 **Interactive Diagram**: Drag, zoom, and explore the architecture
- 🔄 **Real-time Visualization**: Shows data flow between services
- 📱 **Responsive Design**: Works on desktop and tablet devices
- 🎭 **Professional UI**: Modern gradient backgrounds and glassmorphism effects
- 🔍 **Clear Documentation**: Each component shows its responsibilities
- ⚙️ **Configurable**: Easy to modify nodes, connections, and styling
- 🚀 **Performance Optimized**: Built with Next.js and optimized rendering

## 🏗️ Architecture

The visualization represents a complete microservices architecture:

### Backend Services
- **Device Monitoring Service**
  - Configurable data loading (JSON/SQLite)
  - Background data updates
  - Live data emission to other services

- **Alarm Service**
  - Threshold evaluation
  - Rule-based alarm triggers
  - Alarm persistence to database

- **Gateway Service**
  - Central WebSocket hub
  - Event aggregation
  - Real-time routing to frontend

### Data Layer
- **SQLite Database**: Stores alarm rules, alarms, and device data (EF Core)
- **JSON Files**: Alternative device data source

### Frontend
- **Next.js Application**: React-based UI with SignalR, TanStack Table, Chakra UI, and RSuite

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.x or higher
- **npm**: v7.x or higher (or yarn/pnpm)
- **Git**: For version control

## 🚀 Installation

### Step 1: Clone or Create the Project

```bash
# Create a new Next.js project
npx create-next-app@latest device-monitoring-viz

# Navigate to project directory
cd device-monitoring-viz
```

### Step 2: Install Dependencies

```bash
# Install GoJS React and other dependencies
npm install gojs-react gojs sass clsx

# Install dev dependencies
npm install --save-dev @types/gojs
```

### Step 3: Set Up Project Structure

Create the following folder structure:

```
device-monitoring-viz/
├── src/
│   ├── components/
│   │   ├── diagrams/
│   │   │   └── SystemArchitectureDiagram.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   └── index.tsx
│   ├── styles/
│   │   ├── globals.scss
│   │   └── diagram.module.scss
│   └── utils/
│       ├── diagramConfig.ts
│       └── diagramTemplates.ts
└── public/
```

### Step 4: Copy Project Files

Copy all the files from the setup guide into their respective locations.

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
device-monitoring-viz/
├── src/
│   ├── components/
│   │   ├── diagrams/
│   │   │   └── SystemArchitectureDiagram.tsx    # Main diagram component
│   │   └── layout/
│   │       ├── Header.tsx                       # Page header
│   │       └── Footer.tsx                       # Page footer with status
│   ├── pages/
│   │   ├── _app.tsx                             # Next.js app wrapper
│   │   └── index.tsx                            # Home page
│   ├── styles/
│   │   ├── globals.scss                         # Global styles
│   │   └── diagram.module.scss                  # Diagram-specific styles
│   └── utils/
│       ├── diagramConfig.ts                     # Node/link data & icons
│       └── diagramTemplates.ts                  # GoJS templates & initialization
├── public/                                       # Static assets
├── package.json                                  # Dependencies
├── tsconfig.json                                 # TypeScript config
├── next.config.js                                # Next.js config
└── tailwind.config.js                            # Tailwind config
```

## 🎮 Usage

### Basic Usage

The application will automatically render the architecture diagram on the home page. You can:

- **Click and Drag**: Move nodes around (if `allowMove: true`)
- **Scroll**: Zoom in/out on the diagram
- **Hover**: See node details and connection labels
- **Select**: Click nodes to select them

### Viewing the Diagram

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. The diagram will render automatically

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Exporting the Diagram

To export the diagram as an image, you can add export functionality:

```typescript
const diagram = diagramRef.current?.getDiagram();
if (diagram) {
  const img = diagram.makeImageData({
    scale: 1,
    background: 'white'
  });
  // Download or display the image
}
```

## ⚙️ Configuration

### Modifying Nodes

Edit `src/utils/diagramConfig.ts` to add, remove, or modify nodes:

```typescript
export const nodeDataArray: NodeData[] = [
  {
    key: 'newService',
    category: 'service',
    title: 'New Service',
    color: '#3498DB',
    features: [
      '• Feature 1',
      '• Feature 2'
    ]
  },
  // ... existing nodes
];
```

### Modifying Connections

Edit `src/utils/diagramConfig.ts` to change data flow:

```typescript
export const linkDataArray: LinkData[] = [
  { from: 'source', to: 'destination', label: 'Data Type' },
  // ... existing connections
];
```

### Changing Colors

Update node colors in `diagramConfig.ts`:

```typescript
{
  key: 'service1',
  color: '#3498DB',  // Change this hex color
  // ...
}
```

Or modify the shape fill in `diagramTemplates.ts`:

```typescript
$(go.Shape, 'RoundedRectangle', {
  fill: '#4A90E2',  // Default color
  // ...
})
```

### Layout Configuration

Adjust diagram layout in `src/utils/diagramTemplates.ts`:

```typescript
layout: $(go.LayeredDigraphLayout, {
  direction: 0,          // 0=right, 90=down, 180=left, 270=up
  layerSpacing: 100,     // Space between layers
  columnSpacing: 60,     // Space between columns
  setsPortSpots: false
})
```

### Enabling/Disabling Interactions

In `src/utils/diagramTemplates.ts`:

```typescript
const diagram = $(go.Diagram, {
  allowMove: true,      // Allow moving nodes
  allowCopy: false,     // Disable copying
  allowDelete: false,   // Disable deleting
  // ...
});
```

## 🎨 Customization

### Adding New Node Types

1. **Create a new node template** in `diagramTemplates.ts`:

```typescript
diagram.nodeTemplateMap.add('customType',
  $(go.Node, 'Auto',
    // ... node configuration
  )
);
```

2. **Add nodes with the new category** in `diagramConfig.ts`:

```typescript
{
  key: 'customNode',
  category: 'customType',
  title: 'Custom Node'
}
```

### Changing Icons

Replace icon functions in `diagramConfig.ts`:

```typescript
export const createCustomIcon = (): string => {
  // Use a URL
  return 'https://example.com/icon.svg';
  
  // Or use a local file (put in public/icons/)
  return '/icons/custom-icon.svg';
  
  // Or use base64 SVG
  return 'data:image/svg+xml;base64,...';
};
```

### Styling Updates

Modify `src/styles/diagram.module.scss` for visual changes:

```scss
.diagramContainer {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  // Add your custom styles
}
```

### Adding Animations

Add CSS animations in `diagram.module.scss`:

```scss
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.diagramContainer {
  animation: slideIn 0.5s ease-out;
}
```

## 🔧 Troubleshooting

### Common Issues

#### Issue: "Cannot find module 'gojs-react'"

**Solution:**
```bash
npm install gojs-react gojs --legacy-peer-deps
```

#### Issue: Diagram not rendering

**Solution:** Ensure you're using dynamic import with SSR disabled:
```typescript
const Diagram = dynamic(
  () => import('@/components/diagrams/SystemArchitectureDiagram'),
  { ssr: false }
);
```

#### Issue: "Unknown Shape.figure" error

**Solution:** Use only built-in GoJS shapes:
- `RoundedRectangle`
- `Rectangle`
- `Ellipse`
- `Circle`

Or define custom shapes before using them.

#### Issue: TypeScript errors

**Solution:** Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

#### Issue: Canvas not sizing correctly

**Solution:** Ensure parent containers have defined heights:
```scss
.diagramContainer {
  width: 100%;
  height: calc(100vh - 180px);
}
```

### Debug Mode

Enable GoJS debug mode in development:

```typescript
import * as go from 'gojs';

if (process.env.NODE_ENV === 'development') {
  // This will log GoJS warnings and errors
  go.Diagram.licenseKey = "your-dev-license-key";
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Comment complex logic
- Test changes locally before committing
- Update documentation for new features


## 🙏 Acknowledgments

- [GoJS](https://gojs.net/) - Powerful diagramming library
- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- Device Monitoring System team

## 📞 Support

- 📖 Documentation: [GoJS Docs](https://gojs.net/latest/intro/react.html)

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Basic architecture visualization
- Interactive diagram with GoJS React
- Support for multiple node types
- Configurable data sources (SQLite/JSON)

---

**Built with ❤️ using Next.js and GoJS**