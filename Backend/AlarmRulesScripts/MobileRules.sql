INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), 'F0:9F:C2:12:34:56', 'Status', 'Equals', 'Offline', 'Critical', 'Mobile is offline', GETUTCDATE()),
(NEWID(), 'F0:9F:C2:12:34:56', 'Connectivity', 'Equals', 'Low', 'Warning', 'Mobile has low connectivity', GETUTCDATE()),

-- Mobile-Specific Rules
(NEWID(), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Battery Status.Level', 'LessThan', '20', 'Warning', 'Mobile battery is low', GETUTCDATE()),

(NEWID(), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Device Temperature.CPU', 'GreaterThan', '50', 'Critical', 'Mobile CPU temperature is high', GETUTCDATE()),

(NEWID(), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Device Temperature.Battery', 'GreaterThan', '45', 'Warning', 'Mobile battery temperature is high', GETUTCDATE()),

(NEWID(), 'F0:9F:C2:12:34:56', 'dynamicProperties.Network Activity.Current Network.Signal Strength', 'LessThan', '-75', 'Warning', 'Mobile Wi-Fi signal strength is weak', GETUTCDATE()),

(NEWID(), 'F0:9F:C2:12:34:56', 'dynamicProperties.App Activity.Active Apps[].screenTimeToday', 'GreaterThan', '3h', 'Information', 'An app on Mobile has high screen time today', GETUTCDATE());
