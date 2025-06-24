--Ac Rules
INSERT INTO AlarmRules (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
-- 1. Filter Needs Cleaning
(NEWID(), '98:5F:D3:4B:22:AC', 
 'dynamicProperties.Service Logs.Filter Status', 
 'Equals', 'Needs Cleaning', 
 'Information', 
 'Air Conditioner filter requires cleaning',
 GETUTCDATE()),

-- 2. Device Offline
(NEWID(), '98:5F:D3:4B:22:AC', 
 'Status', 
 'Equals', 'Offline', 
 'Critical', 
 'Air Conditioner is currently offline',
 GETUTCDATE()),

-- 3. Wi-Fi Disabled
(NEWID(), '98:5F:D3:4B:22:AC', 
 'staticProperties.Connectivity & Configuration.Wi-Fi Enabled', 
 'Equals', 'false', 
 'Warning', 
 'Air Conditioner Wi-Fi connectivity is lost',
 GETUTCDATE()),

-- 4. Maintenance Overdue
(NEWID(), '98:5F:D3:4B:22:AC', 
 'dynamicProperties.Service Logs.Next Scheduled Maintenance', 
 'IsDatePast', '', 
 'Warning', 
 'Air Conditioner service is overdue',
 GETUTCDATE()),

-- 5. Power Saving Mode Disabled
(NEWID(), '98:5F:D3:4B:22:AC', 
 'dynamicProperties.Power Consumption Stats.Power Saving Mode', 
 'Equals', 'Disabled', 
 'Information', 
 'Power Saving Mode is disabled on Air Conditioner',
 GETUTCDATE());
