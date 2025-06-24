INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), '84:C9:B2:3E:7F:A1', 'Status', 'Equals', 'Offline', 'Critical', 'WiFi Router is offline', GETUTCDATE()),
(NEWID(), '84:C9:B2:3E:7F:A1', 'Connectivity', 'Equals', 'Low', 'Warning', 'WiFi Router connectivity is degraded', GETUTCDATE()),

-- Device-Specific Rules
(NEWID(), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.CPU Usage', 'GreaterThan', '85%', 'Warning', 'WiFi Router CPU usage is high', GETUTCDATE()),

(NEWID(), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Memory Usage.Used', 'GreaterThan', '400 MB', 'Warning', 'WiFi Router memory usage is high', GETUTCDATE()),

(NEWID(), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Temperature.CPU', 'GreaterThan', '70°C', 'Critical', 'WiFi Router CPU temperature is critical', GETUTCDATE()),

(NEWID(), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Temperature.Board', 'GreaterThan', '65°C', 'Warning', 'WiFi Router board temperature is too high', GETUTCDATE()),

(NEWID(), '84:C9:B2:3E:7F:A1', 'dynamicProperties.Network Activity.Connected Clients', 'CountGreaterThan', '20', 'Warning', 'Too many devices connected to WiFi Router', GETUTCDATE());
