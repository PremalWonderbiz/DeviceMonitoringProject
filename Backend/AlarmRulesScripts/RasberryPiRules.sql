INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), 'B8:27:EB:45:67:89', 'Status', 'Equals', 'Offline', 'Critical', 'Raspberry Pi is offline', GETUTCDATE()),
(NEWID(), 'B8:27:EB:45:67:89', 'Connectivity', 'Equals', 'Low', 'Warning', 'Raspberry Pi has low connectivity', GETUTCDATE()),

-- Device-Specific Rules
(NEWID(), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.CPU Usage', 'GreaterThan', '85%', 'Warning', 'Raspberry Pi CPU usage is high', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.System Temperature.CPU', 'GreaterThan', '75°C', 'Critical', 'Raspberry Pi CPU temperature is too high', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.RAM Usage.Used', 'GreaterThan', '3.5 GB', 'Warning', 'Raspberry Pi is running low on RAM', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:67:89', 'dynamicProperties.Network Activity.Interfaces[?name==''eth0''].traffic.upload', 'GreaterThan', '50 Mbps', 'Information', 'Raspberry Pi is uploading at high speed', GETUTCDATE());
