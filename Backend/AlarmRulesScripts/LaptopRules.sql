INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules] 
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- 🔹 Common Rules
(NEWID(), '3C:5A:B4:91:22:AC', 'Status', 'Equals', 'Offline', 'Critical', 'Laptop is offline', GETUTCDATE()),
(NEWID(), '3C:5A:B4:91:22:AC', 'Connectivity', 'Equals', 'Low', 'Warning', 'Laptop has low connectivity', GETUTCDATE()),

-- 🔹 Laptop-Specific Rules
(NEWID(), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Battery.Health', 'Equals', 'Needs Attention', 'Warning', 'Battery health warning on Laptop', GETUTCDATE()),

(NEWID(), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Battery.Level', 'LessThan', '15', 'Warning', 'Battery level is critically low on Laptop', GETUTCDATE()),

(NEWID(), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.CPU Load', 'GreaterThan', '85', 'Warning', 'CPU usage is too high on Laptop', GETUTCDATE()),

(NEWID(), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Temperature.GPU', 'GreaterThan', '85', 'Critical', 'GPU temperature is too high on Laptop', GETUTCDATE()),

(NEWID(), '3C:5A:B4:91:22:AC', 'dynamicProperties.Application Activity.Background Processes', 'GreaterThan', '100', 'Warning', 'High number of background processes on Laptop', GETUTCDATE());
