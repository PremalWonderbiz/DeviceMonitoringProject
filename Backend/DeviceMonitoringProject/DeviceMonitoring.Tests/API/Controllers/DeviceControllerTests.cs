using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Controllers;
using Application.Interface;
using Application.Interfaces;
using DeviceMonitoring.Tests.MockData;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace DeviceMonitoring.Tests.API.Controllers
{
    public class DeviceControllerTests
    {
        [Fact]
        public async Task GetDevicesNameMacIdList_ShouldReturn200Status()
        {
            //Arrange
            var deviceService = new Mock<IDeviceService>();
            var alarmToggleService = new Mock<IAlarmToggleService>();
            deviceService.Setup(_ => _.GetDevicesNameMacIdList()).ReturnsAsync(DevicesNameMacIdListMockData.GetMockDeviceNameMacIdList());
            var sut = new DevicesController(deviceService.Object, alarmToggleService.Object);

            //Act
            var result = await sut.GetDevicesNameMacIdList();

            //Assert
            result.GetType().Should().Be(typeof(OkObjectResult));
            (result as OkObjectResult).StatusCode.Should().Be(200); 
        }
    }
}
