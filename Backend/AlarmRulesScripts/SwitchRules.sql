INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), 'D4:6D:6D:88:11:22', 'Status', 'Equals', 'Offline', 'Critical', 'Network Switch is offline', GETUTCDATE()),
(NEWID(), 'D4:6D:6D:88:11:22', 'Connectivity', 'Equals', 'Low', 'Warning', 'Network Switch has low connectivity', GETUTCDATE()),

-- Switch-Specific Rules
(NEWID(), 'D4:6D:6D:88:11:22', 'dynamicProperties.System Health.CPU Usage', 'GreaterThan', '85%', 'Warning', 'Network Switch CPU usage is high', GETUTCDATE()),

(NEWID(), 'D4:6D:6D:88:11:22', 'dynamicProperties.System Health.Temperature', 'GreaterThan', '70°C', 'Critical', 'Network Switch temperature is critical', GETUTCDATE()),

(NEWID(), 'D4:6D:6D:88:11:22', 'dynamicProperties.Traffic Statistics.Broadcast Storms Detected', 'Equals', 'true', 'Critical', 'Broadcast storm detected on the switch', GETUTCDATE()),

(NEWID(), 'D4:6D:6D:88:11:22', 'dynamicProperties.Security & Logs.Login Attempts[?Success==false]', 'CountGreaterThan', '3', 'Warning', 'Multiple failed login attempts detected on Network Switch', GETUTCDATE());
