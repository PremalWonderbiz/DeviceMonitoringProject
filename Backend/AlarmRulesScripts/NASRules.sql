INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), '00:1B:44:11:3A:B7', 'Status', 'Equals', 'Offline', 'Critical', 'NAS Server is offline', GETUTCDATE()),
(NEWID(), '00:1B:44:11:3A:B7', 'Connectivity', 'Equals', 'Low', 'Warning', 'NAS Server has low connectivity', GETUTCDATE()),

-- NAS-Specific Rules
(NEWID(), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.CPU Usage.Load Percentage', 'GreaterThan', '90', 'Warning', 'NAS Server CPU usage is critically high', GETUTCDATE()),

(NEWID(), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.RAM Usage.Used', 'GreaterThan', '7 GB', 'Warning', 'NAS Server RAM usage is too high', GETUTCDATE()),

(NEWID(), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.System Temperature.CPU', 'GreaterThan', '60°C', 'Critical', 'NAS Server CPU temperature is too high', GETUTCDATE()),

(NEWID(), '00:1B:44:11:3A:B7', 'dynamicProperties.Service Status.Service Health.Cloud Sync', 'Equals', 'Degraded', 'Warning', 'NAS Server Cloud Sync service is degraded', GETUTCDATE());
