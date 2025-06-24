INSERT INTO [DeviceMonitoringDB].[dbo].[AlarmRules] 
    ([Id], [DeviceMacId], [FieldPath], [Operator], [ThresholdValue], [Severity], [MessageTemplate], [CreatedAt])
VALUES
-- 🔹 Common Alarms (Applicable to all devices, including IP Camera)
(NEWID(), '3C:71:BF:12:34:56', 'Status', 'Equals', 'Offline', 'Critical', 'IP Camera is offline', GETUTCDATE()),
(NEWID(), '3C:71:BF:12:34:56', 'Connectivity', 'Equals', 'Low', 'Warning', 'IP Camera has low connectivity', GETUTCDATE()),

-- 🔹 IP Camera Specific Alarms
(NEWID(), '3C:71:BF:12:34:56', 'dynamicProperties.Live Stream.Streaming Status', 'NotEquals', 'Active', 'Critical', 'Live streaming is not active on IP Camera', GETUTCDATE()),

(NEWID(), '3C:71:BF:12:34:56', 'dynamicProperties.System Status.Firmware Update Available', 'Equals', 'true', 'Warning', 'Firmware update available for IP Camera', GETUTCDATE()),

(NEWID(), '3C:71:BF:12:34:56', 'dynamicProperties.System Status.System Temperature', 'GreaterThan', '50', 'Warning', 'IP Camera system temperature is high', GETUTCDATE());
