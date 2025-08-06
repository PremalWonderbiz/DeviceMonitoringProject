using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interface;

namespace Infrastructure.Services
{
    public class AlarmToggleService : IAlarmToggleService
    {
        private bool _isEnabled = false;
        public bool IsAlarmEnabled => _isEnabled;

        public void SetAlarmEnabled(bool enabled)
        {
            _isEnabled = enabled;
        }

    }
}
