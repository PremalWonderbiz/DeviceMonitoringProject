INSERT INTO AlarmRules 
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
-- 🔹 Common Rules
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'Status', 'Equals', 'Offline', 'Critical', 'Laptop is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'Connectivity', 'Equals', 'Low', 'Warning', 'Laptop has low connectivity', CURRENT_TIMESTAMP),

-- 🔹 Laptop-Specific Rules
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Battery.Health', 'Equals', 'Needs Attention', 'Warning', 'Battery health warning on Laptop', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Battery.Level', 'LessThan', '15', 'Warning', 'Battery level is critically low on Laptop', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.CPU Load', 'GreaterThan', '85', 'Warning', 'CPU usage is too high on Laptop', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'dynamicProperties.System Status.Temperature.GPU', 'GreaterThan', '85', 'Critical', 'GPU temperature is too high on Laptop', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:5A:B4:91:22:AC', 'dynamicProperties.Application Activity.Background Processes', 'GreaterThan', '100', 'Warning', 'High number of background processes on Laptop', CURRENT_TIMESTAMP);

INSERT INTO AlarmRules 
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
-- 🔹 Common Alarms (Applicable to all devices, including IP Camera)
(lower(hex(randomblob(16))), '3C:71:BF:12:34:56', 'Status', 'Equals', 'Offline', 'Critical', 'IP Camera is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:71:BF:12:34:56', 'Connectivity', 'Equals', 'Low', 'Warning', 'IP Camera has low connectivity', CURRENT_TIMESTAMP),

-- 🔹 IP Camera Specific Alarms
(lower(hex(randomblob(16))), '3C:71:BF:12:34:56', 'dynamicProperties.Live Stream.Streaming Status', 'NotEquals', 'Active', 'Critical', 'Live streaming is not active on IP Camera', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:71:BF:12:34:56', 'dynamicProperties.System Status.Firmware Update Available', 'Equals', 'true', 'Warning', 'Firmware update available for IP Camera', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '3C:71:BF:12:34:56', 'dynamicProperties.System Status.System Temperature', 'GreaterThan', '50', 'Warning', 'IP Camera system temperature is high', CURRENT_TIMESTAMP);

INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
-- Common Rules
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'Status', 'Equals', 'Offline', 'Critical', 'Network Switch is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'Connectivity', 'Equals', 'Low', 'Warning', 'Network Switch has low connectivity', CURRENT_TIMESTAMP),

-- Switch-Specific Rules
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'dynamicProperties.System Health.CPU Usage', 'GreaterThan', '85%', 'Warning', 'Network Switch CPU usage is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'dynamicProperties.System Health.Temperature', 'GreaterThan', '70 C', 'Critical', 'Network Switch temperature is critical', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'dynamicProperties.Traffic Statistics.Broadcast Storms Detected', 'Equals', 'true', 'Critical', 'Broadcast storm detected on the switch', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'D4:6D:6D:88:11:22', 'dynamicProperties.Security & Logs.Login Attempts[?Success==false]', 'CountGreaterThan', '3', 'Warning', 'Multiple failed login attempts detected on Network Switch', CURRENT_TIMESTAMP);

-- Air Conditioner Rules
INSERT INTO AlarmRules (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), '98:5F:D3:4B:22:AC', 'dynamicProperties.Service Logs.Filter Status', 'Equals', 'Needs Cleaning', 'Information', 'Air Conditioner filter requires cleaning', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '98:5F:D3:4B:22:AC', 'Status', 'Equals', 'Offline', 'Critical', 'Air Conditioner is currently offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '98:5F:D3:4B:22:AC', 'staticProperties.Connectivity & Configuration.Wi-Fi Enabled', 'Equals', 'false', 'Warning', 'Air Conditioner Wi-Fi connectivity is lost', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '98:5F:D3:4B:22:AC', 'dynamicProperties.Service Logs.Next Scheduled Maintenance', 'IsDatePast', '', 'Warning', 'Air Conditioner service is overdue', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '98:5F:D3:4B:22:AC', 'dynamicProperties.Power Consumption Stats.Power Saving Mode', 'Equals', 'Disabled', 'Information', 'Power Saving Mode is disabled on Air Conditioner', CURRENT_TIMESTAMP);

-- NAS Server Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'Status', 'Equals', 'Offline', 'Critical', 'NAS Server is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'Connectivity', 'Equals', 'Low', 'Warning', 'NAS Server has low connectivity', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.CPU Usage.Load Percentage', 'GreaterThan', '90', 'Warning', 'NAS Server CPU usage is critically high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.RAM Usage.Used', 'GreaterThan', '7 GB', 'Warning', 'NAS Server RAM usage is too high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'dynamicProperties.System Health.System Temperature.CPU', 'GreaterThan', '60 C', 'Critical', 'NAS Server CPU temperature is too high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '00:1B:44:11:3A:B7', 'dynamicProperties.Service Status.Service Health.Cloud Sync', 'Equals', 'Degraded', 'Warning', 'NAS Server Cloud Sync service is degraded', CURRENT_TIMESTAMP);

-- WiFi Router Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'Status', 'Equals', 'Offline', 'Critical', 'WiFi Router is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'Connectivity', 'Equals', 'Low', 'Warning', 'WiFi Router connectivity is degraded', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.CPU Usage', 'GreaterThan', '85%', 'Warning', 'WiFi Router CPU usage is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Memory Usage.Used', 'GreaterThan', '400 MB', 'Warning', 'WiFi Router memory usage is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Temperature.CPU', 'GreaterThan', '70 C', 'Critical', 'WiFi Router CPU temperature is critical', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'dynamicProperties.System Status.Temperature.Board', 'GreaterThan', '65 C', 'Warning', 'WiFi Router board temperature is too high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), '84:C9:B2:3E:7F:A1', 'dynamicProperties.Network Activity.Connected Clients', 'CountGreaterThan', '20', 'Warning', 'Too many devices connected to WiFi Router', CURRENT_TIMESTAMP);

-- Mobile Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'Status', 'Equals', 'Offline', 'Critical', 'Mobile is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'Connectivity', 'Equals', 'Low', 'Warning', 'Mobile has low connectivity', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Battery Status.Level', 'LessThan', '20', 'Warning', 'Mobile battery is low', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Device Temperature.CPU', 'GreaterThan', '50', 'Critical', 'Mobile CPU temperature is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'dynamicProperties.Device Health.Device Temperature.Battery', 'GreaterThan', '45', 'Warning', 'Mobile battery temperature is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'dynamicProperties.Network Activity.Current Network.Signal Strength', 'LessThan', '-75', 'Warning', 'Mobile Wi-Fi signal strength is weak', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F0:9F:C2:12:34:56', 'dynamicProperties.App Activity.Active Apps[].screenTimeToday', 'GreaterThan', '3h', 'Information', 'An app on Mobile has high screen time today', CURRENT_TIMESTAMP);

-- Printer Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'Status', 'Equals', 'Offline', 'Critical', 'Printer is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'Connectivity', 'Equals', 'Low', 'Warning', 'Printer has low connectivity', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Toner Level', 'LessThan', '10%', 'Warning', 'Printer toner level is below 10%', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Fuser Unit Life', 'LessThan', '0%', 'Critical', 'Printer fuser unit has exceeded its life', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'dynamicProperties.Consumables.Maintenance Kit Life', 'LessThan', '0%', 'Warning', 'Printer maintenance kit needs to be replaced', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'dynamicProperties.System Health.Temperature.Internal Sensor', 'GreaterThan', '60 C', 'Critical', 'Printer internal temperature is critically high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'F8:16:54:AA:34:12', 'dynamicProperties.Network Activity.Upload Speed', 'LessThan', '0.5 Mbps', 'Warning', 'Printer upload speed is low', CURRENT_TIMESTAMP);

-- Raspberry Pi Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'Status', 'Equals', 'Offline', 'Critical', 'Raspberry Pi is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'Connectivity', 'Equals', 'Low', 'Warning', 'Raspberry Pi has low connectivity', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.CPU Usage', 'GreaterThan', '85%', 'Warning', 'Raspberry Pi CPU usage is high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.System Temperature.CPU', 'GreaterThan', '75 C', 'Critical', 'Raspberry Pi CPU temperature is too high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'dynamicProperties.System Health.RAM Usage.Used', 'GreaterThan', '3.5 GB', 'Warning', 'Raspberry Pi is running low on RAM', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:67:89', 'dynamicProperties.Network Activity.Interfaces[?name==''eth0''].traffic.upload', 'GreaterThan', '50 Mbps', 'Information', 'Raspberry Pi is uploading at high speed', CURRENT_TIMESTAMP);

-- Smart TV Rules
INSERT INTO AlarmRules
    (Id, DeviceMacId, FieldPath, Operator, ThresholdValue, Severity, MessageTemplate, CreatedAt)
VALUES
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'Status', 'Equals', 'Offline', 'Critical', 'Smart TV is offline', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'Connectivity', 'Equals', 'Low', 'Warning', 'Smart TV has low connectivity', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Current Usage.Power State', 'Equals', 'Off', 'Information', 'Smart TV is turned off', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Current Usage.Volume Level', 'GreaterThan', '80', 'Information', 'Smart TV volume level is unusually high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Network Activity.Wi-Fi Signal Strength', 'LessThan', '-70 dBm', 'Warning', 'Smart TV has weak Wi-Fi signal', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.Network Activity.Data Usage.Today', 'GreaterThan', '10 GB', 'Information', 'Smart TV used high data today', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.System Status.Temperature.Panel', 'GreaterThan', '60 C', 'Warning', 'Smart TV panel temperature is too high', CURRENT_TIMESTAMP),
(lower(hex(randomblob(16))), 'B8:27:EB:45:9A:CB', 'dynamicProperties.System Status.Storage Information.Used', 'GreaterThan', '14 GB', 'Warning', 'Smart TV is running out of storage', CURRENT_TIMESTAMP);

-- Alarm States
INSERT INTO AlarmStates (Name)
VALUES 
('Unacknowledged'),
('Investigating'),
('Resolved'),
('Ignored');
