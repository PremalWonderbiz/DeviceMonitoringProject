INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules]
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- Common Rules
(NEWID(), 'F8:16:54:AA:34:12', 'Status', 'Equals', 'Offline', 'Critical', 'Printer is offline', GETUTCDATE()),
(NEWID(), 'F8:16:54:AA:34:12', 'Connectivity', 'Equals', 'Low', 'Warning', 'Printer has low connectivity', GETUTCDATE()),

-- Printer-Specific Rules
(NEWID(), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Toner Level', 'LessThan', '10%', 'Warning', 'Printer toner level is below 10%', GETUTCDATE()),

(NEWID(), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Fuser Unit Life', 'LessThan', '0%', 'Critical', 'Printer fuser unit has exceeded its life', GETUTCDATE()),

(NEWID(), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Maintenance Kit Life', 'LessThan', '0%', 'Warning', 'Printer maintenance kit needs to be replaced', GETUTCDATE()),

(NEWID(), 'F8:16:54:AA:34:12', 'dynamicProperties.System Health.Temperature.Internal Sensor', 'GreaterThan', '60°C', 'Critical', 'Printer internal temperature is critically high', GETUTCDATE()),

(NEWID(), 'F8:16:54:AA:34:12', 'dynamicProperties.Network Activity.Upload Speed', 'LessThan', '0.5 Mbps', 'Warning', 'Printer upload speed is low', GETUTCDATE());
