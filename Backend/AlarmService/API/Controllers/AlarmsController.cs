using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Domain.Interface;
using Application.Dtos;
using Application.Interface;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlarmsController : ControllerBase
    {
        private readonly IAlarmService _alarmService;
        private readonly IAlarmEvaluationService _alarmEvaluationService;

        public AlarmsController(IAlarmService alarmService,IAlarmEvaluationService alarmEvaluationService)
        {
            _alarmService = alarmService;
            _alarmEvaluationService = alarmEvaluationService;
        }

        // GET: api/Alarms
        [HttpPost("getAlarms")]
        public async Task<ActionResult<IEnumerable<GetAlarmDto>>> GetAlarms(AlarmFilter filter)
        {
            var res = await _alarmService.GetAlarms(filter);
            return Ok(res);
        }
        
        // GET: api/Alarms (latest five only)
        [HttpGet("getLatestAlarms")]
        public async Task<ActionResult<GetLatestAlarmsDto>> GetLatestFiveAlarms()
        {
            var res = await _alarmService.GetLatestFiveAlarms();
            return Ok(res);
        }
        
        // GET: api/Alarms (latest for device specific)
        [HttpGet("getLatestAlarmForDevice/{deviceMacId}")]
        public async Task<ActionResult<GetLatestAlarmForDeviceDto>> GetLatestAlarmForDevice(string deviceMacId)
        {
            var res = await _alarmService.GetLatestAlarmForDevice(deviceMacId);
            return Ok(res);
        }
        
        //GET alarms by sourcedeviceid
        // GET: api/Alarms
        [HttpGet("getAlarmsByDeviceId/{id}")]
        public async Task<ActionResult<IEnumerable<GetAlarmDto>>> GetAlarmsByDeviceId(string id)
        {
            var res = await _alarmService.GetAlarmsByDeviceId(id);
            return Ok(res);
        }

        // GET: api/Alarms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetAlarmDto>> GetAlarm(Guid id)
        {
            var alarm = await _alarmService.GetAlarm(id);

            return alarm;
        }

        // PUT: api/Alarms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlarm(Guid id, Alarm alarm)
        {
            var res = await _alarmService.PutAlarm(id, alarm);

            return Ok(res);
        }
        
        [HttpPut("acknowledgeAlarm/{alarmId}")]
        public async Task<IActionResult> AcknowledgeAlarm(Guid alarmId)
        {
            var res = await _alarmService.AcknowledgeAlarm(alarmId);

            return Ok(res);
        }
        
        [HttpPut("resolveAlarm/{alarmId}/{comment}")]
        public async Task<IActionResult> ResolveAlarm(Guid alarmId, string comment)
        {
            var res = await _alarmService.ResolveAlarm(alarmId, comment);

            return Ok(res);
        }

        // POST: api/Alarms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Alarm>> PostAlarm(PostAlarmDto alarm)
        {
            var res = await _alarmService.PostAlarm(alarm);

            return CreatedAtAction("GetAlarm", new { id = res.Id }, res);
        }
        
        // POST: api/Alarms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("testFlattenJson")]
        public async Task<ActionResult<Alarm>> TestFlattenJsonMethod(AlarmEvaluationRequest req)
        {
            var res = await _alarmEvaluationService.EvaluateAsync(req.Current, req.Previous);

            return Ok("GetAlarm");
        }

        // DELETE: api/Alarms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlarm(Guid id)
        {
            var res = await _alarmService.DeleteAlarm(id);
            
            return Ok(res);
        }

        //get alarm states
        // GET: api/Alarms
        [HttpGet("getAlarmStates")]
        public async Task<ActionResult<IEnumerable<GetAlarmStatesDto>>> GetAlarmStates()
        {
            var res = await _alarmService.GetAlarmStates();
            return Ok(res);
        }
    }
}
