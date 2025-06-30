using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Application.Interfaces;

namespace Infrastructure.Helpers
{
    public class DynamicDataHelper : IDynamicDataHelper
    {
        private readonly Random random = new();
        private readonly string[] statuses = { "Online", "Offline" };
        private readonly string[] conns = { "Low", "Medium", "High" };

        string IDynamicDataHelper.GetRandomStatus()
        {
            return statuses[random.Next(statuses.Length)];
        }

        string IDynamicDataHelper.GetRandomConnectivity()
        {
            return conns[random.Next(conns.Length)];
        }

        void IDynamicDataHelper.UpdateRoomAcDynamic(JsonNode dynamicNode)
        {
            var currentStatus = dynamicNode["Current Status"];
            currentStatus["Current Room Temperature"] = $"{27 + random.NextDouble() * 2:F1}°C";
            currentStatus["Humidity Level"] = $"{60 + random.Next(5)}%";
            currentStatus["Fan Speed"] = new[] { "Low", "Medium", "High" }[random.Next(3)];
            currentStatus["Swing Mode"]["Horizontal Swing"] = random.Next(2) == 0 ? "Auto" : "Fixed";

            var sensors = dynamicNode["Sensor Data"]["Temperature Sensors"].AsArray();
            sensors[0]["Reading"] = $"{27 + random.NextDouble() * 2:F1}°C";
            sensors[1]["Reading"] = $"{33 + random.NextDouble() * 2:F1}°C";
            dynamicNode["Sensor Data"]["Humidity Sensor"]["Reading"] = currentStatus["Humidity Level"]!.ToString();

            var powerStats = dynamicNode["Power Consumption Stats"];
            powerStats["Today"] = $"{2.0 + random.NextDouble():F1} kWh";
            powerStats["This Week"] = $"{14 + random.NextDouble():F1} kWh";
            powerStats["This Month"] = $"{63 + random.NextDouble():F1} kWh";

            dynamicNode["Network Activity"]["Last Connected"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            dynamicNode["Network Activity"]["Signal Strength"] = $"{-60 - random.Next(20)} dBm";
        }

        void IDynamicDataHelper.UpdateIpCameraDynamic(JsonNode dynamicNode)
        {
            var liveStream = dynamicNode["Live Stream"];
            liveStream["Streaming Status"] = "Active";
            liveStream["Current Viewers"] = random.Next(0, 5); // Simulate viewers between 0-4
            liveStream["Streaming Bitrate"] = $"{1024 + random.Next(1024)} Kbps";

            var motionDetection = dynamicNode["Motion Detection"];
            motionDetection["Last Motion Detected"]["Timestamp"] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
            motionDetection["Last Motion Detected"]["Zone"] = random.Next(2) == 0 ? "Zone A" : "Zone B";
            motionDetection["Last Motion Detected"]["Detected Object"] = random.Next(2) == 0 ? "Person" : "Animal";

            var motionEvents = motionDetection["Motion Events"].AsArray();
            motionEvents.Insert(0, new JsonObject
            {
                ["Time"] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"),
                ["Zone"] = "Zone A",
                ["Event Type"] = "Motion",
                ["Snapshot URL"] = $"http://192.168.1.88/events/{DateTime.Now:yyyyMMdd_HHmm}.jpg"
            });
            if (motionEvents.Count > 5) motionEvents.RemoveAt(motionEvents.Count - 1); // Keep array manageable

            var network = dynamicNode["Network Activity"];
            network["Data Transferred Today"] = $"{(0.5 + random.NextDouble() * 1.5):F1} GB";
            network["Packet Loss"] = $"{random.NextDouble() * 0.1:F2}%";
            network["Latency"] = $"{10 + random.Next(10)} ms";

            var status = dynamicNode["System Status"];
            status["Uptime"] = $"{random.Next(1, 10)} days {random.Next(0, 23)} hours";
            status["System Temperature"] = $"{40 + random.NextDouble() * 5:F1}°C";
            status["Firmware Update Available"] = random.Next(4) == 0;

            var security = dynamicNode["Security"];
            var loginAttempts = security["Login Attempts"].AsArray();
            loginAttempts.Insert(0, new JsonObject
            {
                ["Username"] = random.Next(2) == 0 ? "admin" : "guest",
                ["Success"] = random.Next(2) == 0,
                ["IP"] = $"192.168.1.{random.Next(100, 255)}",
                ["Time"] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")
            });
            if (loginAttempts.Count > 5) loginAttempts.RemoveAt(loginAttempts.Count - 1);
        }

        void IDynamicDataHelper.UpdateLaptopDynamic(JsonNode dynamicNode)
        {
            // ----------- System Status -----------
            var systemStatus = dynamicNode["System Status"];

            var battery = systemStatus["Battery"];
            int batteryLevel = random.Next(10, 20);
            battery["Level"] = $"{batteryLevel}%";
            battery["Charging Status"] = batteryLevel < 40 && random.Next(2) == 0 ? "Charging" : "Discharging";
            battery["Health"] = random.Next(10) < 8 ? "Good" : "Needs Attention";
            battery["Estimated Time Left"] = $"{random.Next(1, 4)} hrs {random.Next(0, 59)} mins";

            systemStatus["CPU Load"] = $"{random.Next(5, 80)}%";

            var usedRam = 8.0 + random.NextDouble() * 8;
            var totalRam = 32.0;
            systemStatus["RAM Usage"]["Used"] = $"{usedRam:F1} GB";
            systemStatus["RAM Usage"]["Free"] = $"{(totalRam - usedRam):F1} GB";

            systemStatus["GPU Usage"]["Integrated"] = $"{random.Next(2, 15)}%";
            systemStatus["GPU Usage"]["Dedicated"] = $"{random.Next(0, 25)}%";

            systemStatus["Temperature"]["CPU"] = $"{50 + random.NextDouble() * 10:F1}°C";
            systemStatus["Temperature"]["GPU"] = $"{45 + random.NextDouble() * 10:F1}°C";
            systemStatus["Temperature"]["Motherboard"] = $"{40 + random.NextDouble() * 8:F1}°C";

            systemStatus["System Uptime"] = $"{random.Next(1, 6)} days, {random.Next(1, 24)} hours";


            // ----------- Network Activity -----------
            var network = dynamicNode["Network Activity"];
            var wifi = network["Current Wi-Fi"];
            wifi["SSID"] = "Office_Network_5G";
            wifi["IP Address"] = $"10.0.1.{random.Next(10, 255)}";
            wifi["Signal Strength"] = $"{-40 - random.Next(30)} dBm";
            wifi["Data Usage (Today)"]["Download"] = $"{(1.0 + random.NextDouble() * 10):F1} GB";
            wifi["Data Usage (Today)"]["Upload"] = $"{(0.5 + random.NextDouble() * 5):F1} GB";

            var vpn = network["VPN Status"];
            vpn["Connected"] = random.Next(5) != 0; // mostly connected
            vpn["Provider"] = "NordLayer";
            vpn["IP"] = $"172.20.{random.Next(10, 50)}.{random.Next(1, 255)}";


            // ----------- Application Activity -----------
            var appActivity = dynamicNode["Application Activity"];

            // Randomize foreground apps
            var foreground = appActivity["Foreground Apps"].AsArray();
            foreground.Clear();
            foreground.Add(new JsonObject
            {
                ["App Name"] = "Visual Studio Code",
                ["CPU"] = $"{random.Next(5, 20)}%",
                ["Memory"] = $"{(0.9 + random.NextDouble() * 0.5):F1} GB"
            });
            foreground.Add(new JsonObject
            {
                ["App Name"] = "Slack",
                ["CPU"] = $"{random.Next(1, 6)}%",
                ["Memory"] = $"{(0.5 + random.NextDouble() * 0.5):F1} GB"
            });

            appActivity["Background Processes"] = 60 + random.Next(40);

            var recentApps = appActivity["Recent Apps Launched"].AsArray();
            var appPool = new[] { "Zoom", "Figma", "Edge Browser", "Postman", "Jira", "Spotify" };
            recentApps.Clear();
            foreach (var app in appPool.OrderBy(_ => random.Next()).Take(3))
            {
                recentApps.Add(app);
            }
        }

        void IDynamicDataHelper.UpdateMobileDynamic(JsonNode dynamicNode)
        {
            // ----------- Device Health -----------
            var health = dynamicNode["Device Health"];
            var battery = health["Battery Status"];
            int batteryLevel = random.Next(20, 95);
            battery["Level"] = $"{batteryLevel}%";
            battery["Charging State"] = batteryLevel < 40 && random.Next(2) == 0 ? "Charging" : "Not Charging";
            battery["Temperature"] = $"{33 + random.NextDouble() * 4:F1}°C";
            battery["Health"] = random.Next(10) < 9 ? "Good" : "Degraded";

            health["CPU Usage"] = $"{random.Next(15, 80)}%";

            double usedRam = 4.0 + random.NextDouble() * 4;
            double totalRam = 12.0;
            health["RAM Usage"]["Used"] = $"{usedRam:F1} GB";
            health["RAM Usage"]["Free"] = $"{(totalRam - usedRam):F1} GB";

            double usedStorage = 120 + random.NextDouble() * 30;
            double totalStorage = 256.0;
            health["Storage Usage"]["Used"] = $"{usedStorage:F0} GB";
            health["Storage Usage"]["Free"] = $"{(totalStorage - usedStorage):F0} GB";

            health["Device Temperature"]["CPU"] = $"{43 + random.NextDouble() * 5:F1}°C";
            health["Device Temperature"]["Battery"] = battery["Temperature"].ToString();

            health["Uptime"] = $"{random.Next(0, 3)} days, {random.Next(1, 24)} hours";


            // ----------- Network Activity -----------
            var network = dynamicNode["Network Activity"];
            var current = network["Current Network"];
            current["SSID"] = "Home_5G";
            current["IP Address"] = $"192.168.1.{random.Next(100, 199)}";
            current["Signal Strength"] = $"{-45 - random.Next(15)} dBm";

            var todayDownload = 0.5 + random.NextDouble() * 2;
            var todayUpload = 100 + random.Next(400); // in MB
            network["Data Usage"]["Today"]["Download"] = $"{todayDownload:F1} GB";
            network["Data Usage"]["Today"]["Upload"] = $"{todayUpload} MB";

            var monthlyDownload = 25 + random.NextDouble() * 20;
            var monthlyUpload = 5 + random.NextDouble() * 5;
            network["Data Usage"]["Monthly"]["Download"] = $"{monthlyDownload:F1} GB";
            network["Data Usage"]["Monthly"]["Upload"] = $"{monthlyUpload:F1} GB";

            var connectedApps = network["Connected Apps"].AsArray();
            connectedApps.Clear();
            connectedApps.Add(new JsonObject
            {
                ["appName"] = "Spotify",
                ["dataUsage"] = $"Streaming ({200 + random.Next(150)} MB today)"
            });
            connectedApps.Add(new JsonObject
            {
                ["appName"] = "WhatsApp",
                ["dataUsage"] = $"Video call ({100 + random.Next(100)} MB today)"
            });


            // ----------- App Activity -----------
            var appActivity = dynamicNode["App Activity"];
            var activeApps = appActivity["Active Apps"].AsArray();
            activeApps.Clear();
            activeApps.Add(new JsonObject
            {
                ["name"] = "YouTube",
                ["status"] = "Foreground",
                ["screenTimeToday"] = $"{random.Next(0, 2)} hr {random.Next(10, 59)} min"
            });
            activeApps.Add(new JsonObject
            {
                ["name"] = "Gmail",
                ["status"] = "Background",
                ["notifications"] = random.Next(1, 10)
            });

            var batteryUsage = appActivity["Battery Usage by Apps"].AsArray();
            batteryUsage.Clear();
            batteryUsage.Add(new JsonObject
            {
                ["appName"] = "YouTube",
                ["usagePercent"] = $"{random.Next(5, 15)}%"
            });
            batteryUsage.Add(new JsonObject
            {
                ["appName"] = "Google Maps",
                ["usagePercent"] = $"{random.Next(3, 10)}%"
            });
        }

        void IDynamicDataHelper.UpdateNasDynamic(JsonNode dynamicNode)
        {
            // ----------- System Health -----------
            var sysHealth = dynamicNode["System Health"];
            var cpuUsage = random.Next(15, 65);
            sysHealth["CPU Usage"]["Load Percentage"] = cpuUsage;

            for (int i = 0; i < 4; i++)
            {
                sysHealth["CPU Usage"]["Core Usage"][i]["Usage"] = $"{random.Next(30, 70)}%";
            }

            double usedRam = 4.5 + random.NextDouble() * 3;
            sysHealth["RAM Usage"]["Used"] = $"{usedRam:F1} GB";
            sysHealth["RAM Usage"]["Free"] = $"{8 - usedRam:F1} GB";
            sysHealth["RAM Usage"]["Swap Used"] = $"{random.NextDouble():F1} GB";

            sysHealth["System Temperature"]["CPU"] = $"{50 + random.NextDouble() * 5:F1}°C";
            sysHealth["System Temperature"]["System Board"] = $"{39 + random.NextDouble() * 4:F1}°C";
            for (int i = 0; i < 4; i++)
            {
                sysHealth["System Temperature"]["Drive Bays"][i]["Temp"] = $"{36 + random.NextDouble() * 3:F1}°C";
            }

            sysHealth["System Load Average"]["1m"] = (1.0 + random.NextDouble()).ToString("F2");
            sysHealth["System Load Average"]["5m"] = (0.9 + random.NextDouble()).ToString("F2");
            sysHealth["System Load Average"]["15m"] = (0.7 + random.NextDouble()).ToString("F2");

            sysHealth["Uptime"] = $"{random.Next(20, 60)} days, {random.Next(1, 24)} hours";



            // ----------- Network Activity -----------
            var net = dynamicNode["Network Activity"];
            net["Primary IP"] = $"192.168.1.{random.Next(40, 60)}";

            var eth0 = net["Interfaces"][0];
            eth0["Status"] = "Active";
            eth0["Throughput"]["Upload"] = $"{70 + random.Next(30)} Mbps";
            eth0["Throughput"]["Download"] = $"{100 + random.Next(50)} Mbps";
            eth0["Data Transferred"]["Sent"] = $"{(1.0 + random.NextDouble() * 0.5):F1} TB";
            eth0["Data Transferred"]["Received"] = $"{(2.5 + random.NextDouble() * 0.5):F1} TB";

            var eth1 = net["Interfaces"][1];
            bool isEth1Idle = random.Next(0, 3) < 2;
            eth1["Status"] = isEth1Idle ? "Idle" : "Active";
            eth1["Throughput"]["Upload"] = isEth1Idle ? "0 Mbps" : $"{random.Next(10)} Mbps";
            eth1["Throughput"]["Download"] = isEth1Idle ? "0 Mbps" : $"{random.Next(10)} Mbps";
            eth1["Data Transferred"]["Sent"] = isEth1Idle ? "N/A" : $"{random.NextDouble():F2} TB";
            eth1["Data Transferred"]["Received"] = isEth1Idle ? "N/A" : $"{random.NextDouble():F2} TB";

            var clients = net["Connected Clients"].AsArray();
            clients.Clear();
            clients.Add(new JsonObject
            {
                ["IP"] = "192.168.1.102",
                ["Hostname"] = "laptop-prem",
                ["Last Access"] = DateTime.Now.AddMinutes(-random.Next(1, 60)).ToString("yyyy-MM-dd HH:mm")
            });
            clients.Add(new JsonObject
            {
                ["IP"] = "192.168.1.115",
                ["Hostname"] = "mobile-kiran",
                ["Last Access"] = DateTime.Now.AddMinutes(-random.Next(10, 120)).ToString("yyyy-MM-dd HH:mm")
            });



            // ----------- Service Status -----------
            var services = dynamicNode["Service Status"];
            services["Running Services"] = new JsonArray("SMB", "Docker", "Cloud Sync", "Time Machine");

            var health = services["Service Health"];
            health["Docker"] = "Healthy";
            health["Cloud Sync"] = random.Next(10) > 1 ? "Healthy" : "Degraded";
            health["Time Machine"] = "Healthy";

            var diskHealth = services["Disk Health"];
            diskHealth["Status"] = "Healthy";
            diskHealth["Last Checked"] = DateTime.Today.AddDays(-random.Next(0, 5)).ToString("yyyy-MM-dd");
            var smart = diskHealth["SMART Reports"];
            foreach (var report in smart.AsArray())
            {
                report["Health"] = "Good";
                report["Reallocated Sectors"] = random.Next(0, 2);
            }

            var fans = services["Fan Status"];
            fans["Fan 1"]["Speed"] = $"{1100 + random.Next(200)} RPM";
            fans["Fan 1"]["Status"] = "Normal";
            fans["Fan 2"]["Speed"] = $"{1100 + random.Next(200)} RPM";
            fans["Fan 2"]["Status"] = "Normal";

            services["Last Backup"]["Status"] = "Success";
            services["Last Backup"]["Timestamp"] = DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(15).ToString("yyyy-MM-dd HH:mm");
        }

        void IDynamicDataHelper.UpdatePrinterDynamic(JsonNode dynamicNode)
        {
            // ---------- Print Status ----------
            var printStatus = dynamicNode["Print Status"];
            var currentJob = printStatus["Current Job"];

            int remainingPages = currentJob["Pages"].GetValue<int>();
            string status = currentJob["Status"].ToString();

            if (status == "Printing")
            {
                int pagesPrinted = Math.Min(remainingPages, random.Next(1, 4));
                currentJob["Pages"] = remainingPages - pagesPrinted;

                if (remainingPages - pagesPrinted <= 0)
                {
                    // Move current job to recent
                    var recentJobs = printStatus["Recent Jobs"].AsArray();
                    recentJobs.Insert(0, new JsonObject
                    {
                        ["Job Name"] = currentJob["Job Name"]?.ToString(),
                        ["Status"] = "Completed",
                        ["Time"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm")
                    });

                    // Load next job if exists
                    int queueLength = printStatus["Queue Length"].GetValue<int>();
                    if (queueLength > 0)
                    {
                        currentJob["Job Name"] = $"Document_{random.Next(1000)}.pdf";
                        currentJob["Pages"] = random.Next(2, 10);
                        currentJob["Status"] = "Printing";
                        currentJob["Submitted By"] = "deepak.r";
                        printStatus["Queue Length"] = queueLength - 1;
                    }
                    else
                    {
                        currentJob["Status"] = "Idle";
                        currentJob["Pages"] = 0;
                    }
                }
            }

            // ---------- Consumables ----------
            var consumables = dynamicNode["Consumables"];
            int toner = int.Parse(consumables["Toner Level"].ToString().Trim('%'));
            if (status == "Printing" && toner > 0)
                consumables["Toner Level"] = $"{toner - random.Next(1, 3)}%";

            int fuser = int.Parse(consumables["Fuser Unit Life"].ToString().Trim('%'));
            consumables["Fuser Unit Life"] = $"{fuser - (random.Next(100) < 5 ? 1 : 0)}%";

            int kit = int.Parse(consumables["Maintenance Kit Life"].ToString().Trim('%'));
            consumables["Maintenance Kit Life"] = $"{kit - (random.Next(100) < 3 ? 1 : 0)}%";

            var tray1 = consumables["Paper Tray Status"]["Tray 1"];
            var tray2 = consumables["Paper Tray Status"]["Tray 2"];
            int tray1Sheets = ExtractSheetCount(tray1.ToString());
            int tray2Sheets = ExtractSheetCount(tray2.ToString());

            if (status == "Printing")
            {
                int pagesUsed = random.Next(1, 4);
                if (tray1Sheets >= pagesUsed)
                    tray1Sheets -= pagesUsed;
                else
                    tray2Sheets -= pagesUsed;

                consumables["Paper Tray Status"]["Tray 1"] = $"Loaded ({tray1Sheets} sheets)";
                consumables["Paper Tray Status"]["Tray 2"] = $"Loaded ({tray2Sheets} sheets)";
            }


            // ---------- Network Activity ----------
            var net = dynamicNode["Network Activity"];
            net["Upload Speed"] = $"{(0.5 + random.NextDouble() * 2):F1} Mbps";
            net["Download Speed"] = $"{(1.0 + random.NextDouble() * 2):F1} Mbps";

            var clients = net["Connected Clients"].AsArray();
            if (random.Next(100) < 30)
            {
                clients.Add("kavita.s");
                if (clients.Count > 5) clients.RemoveAt(0);
            }


            // ---------- System Health ----------
            var health = dynamicNode["System Health"];
            double internalTemp = 43 + random.NextDouble() * 5;
            double ambientTemp = 30 + random.NextDouble() * 2;

            health["Temperature"]["Internal Sensor"] = $"{internalTemp:F1}°C";
            health["Temperature"]["Ambient"] = $"{ambientTemp:F1}°C";

            string[] uptimeSplit = health["Uptime"].ToString().Split(new[] { "days", "hours", ",", " " }, StringSplitOptions.RemoveEmptyEntries);
            int days = int.Parse(uptimeSplit[0]);
            int hours = int.Parse(uptimeSplit[1]) + 1;

            if (hours >= 24) { days++; hours = 0; }
            health["Uptime"] = $"{days} days, {hours} hours";

            if (random.Next(100) < 5)
            {
                var errors = health["Error Logs"].AsArray();
                errors.Add($"Paper jam detected in Tray {random.Next(1, 3)} at {DateTime.Now:yyyy-MM-dd HH:mm}");
            }
        }

        int ExtractSheetCount(string status)
        {
            var match = Regex.Match(status, @"(\d+)\s+sheets");
            return match.Success ? int.Parse(match.Groups[1].Value) : 0;
        }

        void IDynamicDataHelper.UpdateRaspberryPiDynamic(JsonNode dynamicNode)
        {
            var systemHealth = dynamicNode["System Health"];
            systemHealth["CPU Usage"] = $"{random.Next(20, 70)}%";
            double usedRam = Math.Round(0.8 + random.NextDouble() * 2.5, 1); // Simulate 0.8 - 3.3 GB
            systemHealth["RAM Usage"]["Used"] = $"{usedRam} GB";
            systemHealth["RAM Usage"]["Total"] = "4 GB";
            systemHealth["System Temperature"]["CPU"] = $"{55 + random.Next(10)}°C";
            systemHealth["System Temperature"]["Board"] = $"{40 + random.Next(10)}°C";
            systemHealth["Uptime"] = $"{random.Next(1, 10)} days, {random.Next(0, 23)} hours";
            systemHealth["System Load"] = new JsonArray
    {
        Math.Round(random.NextDouble(), 2),
        Math.Round(random.NextDouble() + 0.3, 2),
        Math.Round(random.NextDouble() + 0.5, 2)
    };

            var network = dynamicNode["Network Activity"];
            var eth = network["Interfaces"][0];
            eth["ipAddress"] = $"192.168.1.{random.Next(30, 40)}";
            eth["traffic"]["upload"] = $"{random.Next(2, 10)} Mbps";
            eth["traffic"]["download"] = $"{random.Next(20, 80)} Mbps";

            var wlan = network["Interfaces"][1];
            wlan["ipAddress"] = null; // Still disabled
            wlan["status"] = "Disabled";

            network["Total Data Usage"]["Sent"] = $"{(90 + random.NextDouble() * 20):F1} GB";
            network["Total Data Usage"]["Received"] = $"{(250 + random.NextDouble() * 30):F1} GB";

            var clients = network["Connected Clients (Media Server)"].AsArray();
            clients.Clear();
            clients.Add(new JsonObject
            {
                ["deviceName"] = "Smart TV",
                ["ip"] = $"192.168.1.{random.Next(80, 90)}",
                ["mediaStream"] = "HD Movie (5.1 GB transferred)"
            });
            if (random.Next(2) == 0)
            {
                clients.Add(new JsonObject
                {
                    ["deviceName"] = "Mobile Device",
                    ["ip"] = $"192.168.1.{random.Next(100, 110)}",
                    ["mediaStream"] = "Music Stream (Streaming)"
                });
            }

            var serviceStatus = dynamicNode["Service Status"];
            var serviceHealth = serviceStatus["Service Health"].AsArray();
            serviceHealth.Clear();

            serviceHealth.Add(new JsonObject
            {
                ["service"] = "Kodi",
                ["status"] = "Running",
                ["activeClients"] = random.Next(1, 4)
            });
            serviceHealth.Add(new JsonObject
            {
                ["service"] = "Pi-hole",
                ["status"] = "Running",
                ["dnsQueriesBlocked"] = $"{random.Next(4000, 9000):N0}"
            });

            if (random.Next(3) == 0) // Occasionally reboot reason update
                serviceStatus["Last Reboot Reason"] = "Scheduled maintenance";

            var firmware = serviceStatus["Firmware"];
            bool updateAvailable = random.Next(5) == 0;
            firmware["Update Available"] = updateAvailable;
            if (updateAvailable)
            {
                firmware["Last Update"] = DateTime.Now.AddDays(-random.Next(10)).ToString("yyyy-MM-dd");
                firmware["Current Version"] = $"2025.{random.Next(1, 12):00}.{random.Next(1, 30):00}";
            }
        }

        void IDynamicDataHelper.UpdateSmartTvDynamic(JsonNode dynamicNode)
        {
            var usage = dynamicNode["Current Usage"];
            usage["Power State"] = random.Next(10) > 1 ? "On" : "Off"; // Mostly On
            usage["Input Source"] = $"HDMI {random.Next(1, 5)}";
            var apps = new[] { "Netflix", "YouTube", "Prime Video", "Disney+ Hotstar" };
            usage["Current App"] = apps[random.Next(apps.Length)];
            usage["Volume Level"] = random.Next(0, 100);
            usage["Mute"] = random.Next(10) == 0;
            usage["Picture Mode"] = random.Next(2) == 0 ? "Cinema" : "Vivid";
            usage["Audio Output"] = random.Next(3) == 0 ? "External Speakers" : "TV Speakers";
            usage["Ambient Light Sensor"] = random.Next(2) == 0 ? "Enabled" : "Disabled";

            var stream = dynamicNode["Streaming Activity"];
            var watchHistory = stream["Watch History (Today)"].AsArray();
            watchHistory.Clear();

            // Add one or two watch history items
            var now = DateTime.Now;
            watchHistory.Add(new JsonObject
            {
                ["App"] = "Netflix",
                ["Title"] = "The Crown",
                ["Start Time"] = now.AddMinutes(-90).ToString("s"),
                ["Duration"] = $"{random.Next(20, 50)} min"
            });
            if (random.Next(2) == 0)
            {
                watchHistory.Add(new JsonObject
                {
                    ["App"] = "YouTube",
                    ["Title"] = "Gadget Reviews",
                    ["Start Time"] = now.AddMinutes(-30).ToString("s"),
                    ["Duration"] = $"{random.Next(10, 30)} min"
                });
            }

            var session = stream["Active App Sessions"].AsArray();
            session.Clear();
            session.Add(new JsonObject
            {
                ["App"] = usage["Current App"].ToString(),
                ["Status"] = "Streaming",
                ["Data Used"] = $"{random.Next(400, 900)} MB"
            });

            stream["AutoPlay Next Episode"] = random.Next(10) > 1;

            var network = dynamicNode["Network Activity"];
            network["IP Address"] = $"192.168.1.{random.Next(40, 50)}";
            network["Wi-Fi Signal Strength"] = $"-{random.Next(40, 70)} dBm";
            network["Connection Type"] = "Wi-Fi";
            network["Data Usage"]["Today"] = $"{(1.0 + random.NextDouble() * 3.0):0.0} GB";
            network["Data Usage"]["This Week"] = $"{(8.0 + random.NextDouble() * 6.0):0.1} GB";
            network["Data Usage"]["This Month"] = $"{(40.0 + random.NextDouble() * 20.0):0.1} GB";
            network["Last Online"] = DateTime.Now.AddMinutes(-random.Next(1, 10)).ToString("s");

            var status = dynamicNode["System Status"];
            status["Uptime"] = $"{random.Next(0, 24)} hours {random.Next(0, 59)} minutes";
            status["Last Reboot"] = DateTime.Now.AddHours(-random.Next(10, 48)).ToString("s");

            bool updateAvailable = random.Next(4) == 0;
            status["Software Update Available"] = updateAvailable;
            if (updateAvailable)
            {
                status["Last Software Update"] = DateTime.Now.AddDays(-random.Next(10, 40)).ToString("yyyy-MM-dd");
            }

            double used = Math.Round(6.0 + random.NextDouble() * 4.0, 1); // 6.0 - 10.0 GB
            double free = 16.0 - used;
            status["Storage Info"]["Used"] = $"{used:F1} GB";
            status["Storage Info"]["Free"] = $"{free:F1} GB";
            status["Storage Info"]["Total Storage"] = "16 GB";

            status["Temperature"]["Panel"] = $"{37 + random.Next(6)}°C";
            status["Temperature"]["Mainboard"] = $"{39 + random.Next(6)}°C";
        }

        void IDynamicDataHelper.UpdateSwitchDynamic(JsonNode dynamicNode)
        {
            // 1. Port Status Updates
            var ports = dynamicNode["Port Status"].AsArray();
            foreach (var port in ports)
            {
                bool isUp = random.Next(10) > 1;
                port["Link Status"] = isUp ? "Up" : "Down";

                if (isUp)
                {
                    var devices = new[] { "NAS Server", "Access Point", "Firewall", "Printer", "Core Router" };
                    port["Connected Device"] = devices[random.Next(devices.Length)];
                    port["Current Throughput"] = $"{random.Next(100, 950)} Mbps";
                }
                else
                {
                    port["Connected Device"] = null;
                    port["Current Throughput"] = "0 Mbps";
                }
            }

            // 2. System Health
            var health = dynamicNode["System Health"];
            health["CPU Usage"] = $"{random.Next(10, 85)}%";
            double usedRam = Math.Round(0.5 + random.NextDouble() * 1.3, 1); // e.g., 0.5 – 1.8 GB
            health["RAM Usage"] = $"{usedRam} GB / 2 GB";
            health["Temperature"] = $"{45 + random.Next(0, 8)}°C";
            health["Fan Status"] = random.Next(30) == 0 ? "Failed" : "Operational";

            // 3. Traffic Statistics
            var traffic = dynamicNode["Traffic Statistics"];
            double sent = 6.5 + random.NextDouble() * 0.3;
            double recv = 9.3 + random.NextDouble() * 0.5;
            traffic["Total Data Sent"] = $"{sent:0.00} TB";
            traffic["Total Data Received"] = $"{recv:0.00} TB";
            traffic["Packet Errors"]["Inbound"] = random.Next(0, 20);
            traffic["Packet Errors"]["Outbound"] = random.Next(0, 10);
            traffic["Broadcast Storms Detected"] = random.Next(20) == 0;

            // 4. VLANs & Routing (rarely changes, optional shuffle)
            var activeVlans = dynamicNode["VLANs & Routing"]["Active VLANs"].AsArray();
            if (random.Next(15) == 0) // Rarely add or remove
            {
                var vlanSet = new HashSet<int> { 10, 20, 30, 99 };
                if (random.Next(2) == 0) vlanSet.Add(40);
                else vlanSet.Remove(99);

                activeVlans.Clear();
                foreach (var vlan in vlanSet)
                    activeVlans.Add(vlan);
            }

            // 5. Security & Logs
            var sec = dynamicNode["Security & Logs"];

            // Append Login Attempt
            var attempts = sec["Login Attempts"].AsArray();
            if (random.Next(3) == 0)
            {
                attempts.Add(new JsonObject
                {
                    ["User"] = random.Next(5) == 0 ? "guest" : "admin",
                    ["IP"] = $"192.168.0.{random.Next(10, 100)}",
                    ["Time"] = DateTime.Now.ToString("s"),
                    ["Success"] = random.Next(4) != 0
                });
                if (attempts.Count > 5) attempts.RemoveAt(0);
            }

            // Append Event Log
            var logs = sec["Recent Logs"].AsArray();
            if (random.Next(2) == 0)
            {
                var port = $"Gig1/0/{random.Next(1, 5)}";
                var actions = new[] { "went UP", "went DOWN", "PoE fault", "Security violation detected" };
                logs.Add(new JsonObject
                {
                    ["Timestamp"] = DateTime.Now.ToString("s"),
                    ["Event"] = $"Interface {port} {actions[random.Next(actions.Length)]}"
                });
                if (logs.Count > 6) logs.RemoveAt(0);
            }
        }

        void IDynamicDataHelper.UpdateWifiRouterDynamic(JsonNode dynamicNode)
        {
            // 1. System Status
            var system = dynamicNode["System Status"];
            system["CPU Usage"] = $"{random.Next(15, 70)}%";

            double usedRam = Math.Round(120 + random.NextDouble() * 200, 1); // e.g., 120–320 MB
            system["Memory Usage"]["Used"] = $"{usedRam} MB";

            system["Temperature"]["CPU"] = $"{55 + random.Next(0, 6)}°C";
            system["Temperature"]["Board"] = $"{42 + random.Next(0, 5)}°C";

            system["System Load Average"][0] = (random.NextDouble() * 1.2).ToString("0.00");
            system["System Load Average"][1] = (random.NextDouble() * 1.0).ToString("0.00");
            system["System Load Average"][2] = (random.NextDouble() * 0.8).ToString("0.00");

            // 2. Network Activity: Interfaces Traffic
            var interfaces = dynamicNode["Network Activity"]["Interfaces"].AsArray();
            foreach (var iface in interfaces)
            {
                iface["traffic"]["upload"] = $"{random.Next(5, 60)} Mbps";
                iface["traffic"]["download"] = $"{random.Next(20, 150)} Mbps";
            }

            // 3. Connected Clients – simulate signal fluctuation
            var clients = dynamicNode["Network Activity"]["Connected Clients"].AsArray();
            foreach (var client in clients)
            {
                if (client["connection"]["type"].ToString() == "Wi-Fi")
                {
                    int signal = -40 - random.Next(10, 30); // realistic range -50 to -70 dBm
                    client["connection"]["signalStrength"] = $"{signal} dBm";
                }
            }

            // 4. Total Data Usage
            var usage = dynamicNode["Network Activity"]["Total Data Usage"];
            double sent = 834 + random.NextDouble() * 5;
            double recv = 1200 + random.NextDouble() * 7;
            usage["Sent"] = $"{sent:0.00} GB";
            usage["Received"] = $"{recv / 1000:0.00} TB";

            // 5. Service Health
            var service = dynamicNode["Service Health"];

            // Simulate rare service failure
            if (random.Next(20) == 0)
            {
                var allServices = new[] { "DHCP", "DNS Resolver", "NAT", "Firewall" };
                string failed = allServices[random.Next(allServices.Length)];
                var failedArr = service["Failed Services"].AsArray();
                if (!failedArr.Any(f => f.ToString() == failed))
                    failedArr.Add(failed);
            }
            else
            {
                // Random chance to recover services
                var failedArr = service["Failed Services"].AsArray();
                if (failedArr.Count > 0 && random.Next(3) == 0)
                    failedArr.Clear();
            }

            // Firmware Update check: rare toggle
            service["Firmware"]["Update Available"] = random.Next(15) == 0;
        }

    }
}
