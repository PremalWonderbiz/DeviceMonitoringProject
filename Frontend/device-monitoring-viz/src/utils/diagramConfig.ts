export const createServiceIcon = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMCA2Yy0uNjYgMC0xLjItLjU0LTEuMi0xLjJzLjU0LTEuMiAxLjItMS4yIDEuMi41NCAxLjIgMS4yLS41NCAxLjItMS4yIDEuMk0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=';
};

export const createFrontendIcon = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMCA0SDR2MmgxNlY0ek0yMSA4aC0zdjhoM3YtOHpNMTggOEg2djhoMTJWOHpNMyA4SDB2OGgzVjh6Ii8+PC9zdmc+';
};

export const createDatabaseIcon = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAzQzcuNTggMyA0IDQuNzkgNCA3czMuNTggNCA4IDQgOC0xLjc5IDgtNFMxNi40MiAzIDEyIDN6bTggNmMwIDIuMjEtMy41OCA0LTggNHMtOC0xLjc5LTgtNFY3YzAgMi4yMSAzLjU4IDQgOCA0czgtMS43OSA4LTR2MnptMCA0YzAgMi4yMS0zLjU4IDQtOCA0cy04LTEuNzktOC00di0yYzAgMi4yMSAzLjU4IDQgOCA0czgtMS43OSA4LTR2MnptMCA0YzAgMi4yMS0zLjU4IDQtOCA0cy04LTEuNzktOC00di0yYzAgMi4yMSAzLjU4IDQgOCA0czgtMS43OSA4LTR2MnoiLz48L3N2Zz4=';
};

export interface NodeData {
  key: string;
  category: string;
  title: string;
  subtitle?: string;
  color?: string;
  features?: string[];
}

export interface LinkData {
  from: string;
  to: string;
  label: string;
}

export const nodeDataArray: NodeData[] = [
  {
    key: 'sqlite',
    category: 'database',
    title: 'SQLite Database',
    subtitle: 'EF Core',
    features: [
      '• Alarm rules storage',
      '• Alarms history',
      '• Device data',
      '• Configuration'
    ]
  },
  {
    key: 'jsonFiles',
    category: 'data',
    title: 'JSON Files',
    subtitle: 'Device Data'
  },
  {
    key: 'deviceService',
    category: 'service',
    title: 'Device Monitoring',
    color: '#3498DB',
    features: [
      '• AppSettings config',
      '• Load: JSON/SQLite',
      '• Background updates',
      '• Live data emission'
    ]
  },
  {
    key: 'alarmService',
    category: 'service',
    title: 'Alarm Service',
    color: '#E74C3C',
    features: [
      '• Threshold evaluation',
      '• Rule-based triggers',
      '• Alarm persistence',
      '• Alert generation'
    ]
  },
  {
    key: 'gateway',
    category: 'service',
    title: 'Gateway Service',
    color: '#9B59B6',
    features: [
      '• Central WebSocket hub',
      '• Event aggregation',
      '• Real-time routing'
    ]
  },
  {
    key: 'frontend',
    category: 'frontend',
    title: 'Next.js Frontend',
    features: [
      '• React + Pages Router',
      '• SignalR integration',
      '• TanStack Table',
      '• Chakra UI + RSuite'
    ]
  }
];

export const linkDataArray: LinkData[] = [
  // Data sources to Device Service
  { from: 'sqlite', to: 'deviceService', label: 'Load Data' },
  { from: 'jsonFiles', to: 'deviceService', label: 'Load Data' },
  
  // Device Service connections
  { from: 'deviceService', to: 'alarmService', label: 'Device Updates' },
  { from: 'deviceService', to: 'gateway', label: 'Live Data' },
  
  // Alarm Service connections
  { from: 'alarmService', to: 'sqlite', label: 'Store Alarms' },
  { from: 'alarmService', to: 'gateway', label: 'Alarm Triggers' },
  { from: 'sqlite', to: 'alarmService', label: 'Load Rules' },
  
  // Gateway to Frontend
  { from: 'gateway', to: 'frontend', label: 'WebSocket' }
];