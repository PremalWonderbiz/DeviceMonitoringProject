INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common
(NEWID(), 'B8:27:EB:45:9A:CB', 'Status', 'Equals', 'Offline', 'Critical', 'Smart TV is offline', GETUTCDATE()),
(NEWID(), 'B8:27:EB:45:9A:CB', 'Connectivity', 'Equals', 'Low', 'Warning', 'Smart TV has low connectivity', GETUTCDATE()),

-- Device Specific
(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Current Usage.Power State', 'Equals', 'Off', 'Informationrmation', 'Smart TV is turned off', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Current Usage.Volume Level', 'GreaterThan', '80', 'Informationrmation', 'Smart TV volume level is unusually high', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Network Activity.Wi-Fi Signal Strength', 'LessThan', '-70 dBm', 'Warning', 'Smart TV has weak Wi-Fi signal', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Network Activity.Data Usage.Today', 'GreaterThan', '10 GB', 'Informationrmation', 'Smart TV used high data today', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.System Status.Temperature.Panel', 'GreaterThan', '60°C', 'Warning', 'Smart TV panel temperature is too high', GETUTCDATE()),

(NEWID(), 'B8:27:EB:45:9A:CB', 'dynamicProperties.System Status.Storage Informationrmation.Used', 'GreaterThan', '14 GB', 'Warning', 'Smart TV is running out of storage', GETUTCDATE());
