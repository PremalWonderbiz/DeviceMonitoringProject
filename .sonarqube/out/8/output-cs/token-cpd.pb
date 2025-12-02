Í
ÜC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Interface\IAlarmService.cs
	namespace 	
Domain
 
. 
	Interface 
{ 
public 

	interface 
IAlarmService "
{ 
public 
Task 
< 
IEnumerable 
<  
GetAlarmDto  +
>+ ,
>, -
	GetAlarms. 7
(7 8
AlarmFilter8 C
filterD J
)J K
;K L
public		 
Task		 
<		 &
GetLatestAlarmForDeviceDto		 .
>		. /#
GetLatestAlarmForDevice		0 G
(		G H
string		H N
deviceMacId		O Z
)		Z [
;		[ \
public 
Task 
< 
IEnumerable 
<  
GetAlarmDto  +
>+ ,
>, -
GetAlarmsByDeviceId. A
(A B
stringB H
idI K
)K L
;L M
public 
Task 
< 
GetAlarmDto 
>  
GetAlarm! )
() *
Guid* .
id/ 1
)1 2
;2 3
public 
Task 
< 
string 
> 
PutAlarm $
($ %
Guid% )
id* ,
,, -
Alarm. 3
alarm4 9
)9 :
;: ;
public 
Task 
< 
GetAlarmDto 
>  
InvestigateAlarm! 1
(1 2
Guid2 6
alarmId7 >
)> ?
;? @
public 
Task 
< 
GetAlarmDto 
>  
ResolveAlarm! -
(- .
Guid. 2
alarmId3 :
,: ;
string< B
commentC J
)J K
;K L
public 
Task 
< 
Alarm 
> 
	PostAlarm $
($ %
PostAlarmDto% 1
alarm2 7
)7 8
;8 9
public 
Task 
< 
GetAlarmDto 
>  
IgnoreAlarm! ,
(, -
Guid- 1
id2 4
,4 5
string6 <
comment= D
)D E
;E F
public 
Task 
< 
GetLatestAlarmsDto &
>& '
GetLatestFiveAlarms( ;
(; <
)< =
;= >
public 
Task 
< 
IEnumerable 
<  
GetAlarmStatesDto  1
>1 2
>2 3
GetAlarmStates4 B
(B C
)C D
;D E
public 
Task 
< 
string 
> 
AddAlarmRulesAsync .
(. /
string/ 5
deviceMacId6 A
,A B
ListC G
<G H
AlarmRuleDtoH T
>T U
rulesV [
)[ \
;\ ]
}   
}!! ö
êC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Interface\IAlarmEvaluationService.cs
	namespace		 	
Application		
 
.		 
	Interface		 
{

 
public 

	interface #
IAlarmEvaluationService ,
{ 
public 
Task 
< 
List 
< 
Alarm 
> 
>  !
EvaluateTopLevelAsync! 6
(6 7!
TopLevelDeviceDataDto7 L
currentM T
,T U!
TopLevelDeviceDataDtoV k
previousl t
)t u
;u v
public 
Task 
< 
List 
< 
Alarm 
> 
>   
EvaluateDynamicAsync! 5
(5 6 
DynamicDeviceDataDto6 J
currentK R
,R S 
DynamicDeviceDataDtoT h
previousi q
)q r
;r s
} 
} è
ÄC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\PostAlarmDto.cs
	namespace 	
Application
 
. 
Dtos 
{		 
public

 

class

 
PostAlarmDto

 
{ 
public 
string 
SourceDeviceMacId '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
=6 7
default8 ?
!? @
;@ A
public 
AlarmSeverity 
Severity %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
=4 5
AlarmSeverity6 C
.C D
WarningD K
;K L
public 
string 
Message 
{ 
get  #
;# $
set% (
;( )
}* +
=, -
default. 5
!5 6
;6 7
} 
} û	
ÖC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\LiveDeviceDataDto.cs
	namespace 	
Application
 
. 
Dtos 
{		 
public

 

class

 
LiveDeviceDataDto

 "
{ 
public 
string 
DeviceMacId !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
default2 9
!9 :
;: ;
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
default- 4
!4 5
;5 6
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
=1 2
default3 :
!: ;
;; <
public 
JsonElement 
DynamicProperties ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
} 
} «
ÜC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\LiveDataExtractDto.cs
	namespace 	
Application
 
. 
Dtos 
{		 
public

 

class

 !
TopLevelDeviceDataDto

 &
{ 
public 
string 
DeviceMacId !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
default2 9
!9 :
;: ;
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
$str- 6
;6 7
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
=1 2
$str3 <
;< =
} 
public 

class  
DynamicDeviceDataDto %
{ 
public 
string 
DeviceMacId !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
default2 9
!9 :
;: ;
public 
JsonElement 
DynamicProperties ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
} 
} ¬
ÜC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\GetLatestAlarmsDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
GetLatestAlarmsDto		 #
{

 
public 
int 
TotalAlarms 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
List 
< 
GetAlarmDto 
>  
Alarms! '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} °
éC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\GetLatestAlarmForDeviceDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 &
GetLatestAlarmForDeviceDto		 +
{

 
public 
int 
TotalAlarms 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
GetAlarmDto 
Alarm  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
} ¬
ÖC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\GetAlarmStatesDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
GetAlarmStatesDto		 "
{

 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
=) *
default+ 2
!2 3
;3 4
} 
} ã
C:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\GetAlarmDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
GetAlarmDto		 
{

 
public 
Guid 
Id 
{ 
get 
; 
set !
;! "
}# $
public 
string 
SourceDeviceMacId '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 
Severity 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
Message 
{ 
get  #
;# $
set% (
;( )
}* +
public 
DateTime 
RaisedAt  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
bool 
IsAcknowledged "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
AcknowledgedAt '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
public 
string 

AlarmState  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
AlarmComment "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
AcknowledgedFrom &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
} 
} Ø
ÄC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\AlarmRuleDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
AlarmRuleDto		 
{

 
public 
string 
	FieldPath 
{  !
get" %
;% &
set' *
;* +
}, -
=. /
default0 7
!7 8
;8 9
public 
string 
Operator 
{  
get! $
;$ %
set& )
;) *
}+ ,
=- .
default/ 6
!6 7
;7 8
public 
string 
ThresholdValue $
{% &
get' *
;* +
set, /
;/ 0
}1 2
=3 4
default5 <
!< =
;= >
public 
string 
Severity 
{  
get! $
;$ %
set& )
;) *
}+ ,
=- .
default/ 6
!6 7
;7 8
public 
string 
MessageTemplate %
{& '
get( +
;+ ,
set- 0
;0 1
}2 3
=4 5
default6 =
!= >
;> ?
} 
} ‘
C:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\AlarmFilter.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
AlarmFilter		 
{

 
public 
List 
< 
string 
> 
Devices #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
string 
[ 
] 
FilterDateRange '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
} 
} ó
äC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\AlarmService\Application\Dtos\AlarmEvaluationRequest.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 *
TopLevelAlarmEvaluationRequest		 /
{

 
public 
string 
Type 
{ 
get  
;  !
set" %
;% &
}' (
=) *
$str+ 5
;5 6
public !
TopLevelDeviceDataDto $
Previous% -
{. /
get0 3
;3 4
set5 8
;8 9
}: ;
=< =
default> E
!E F
;F G
public !
TopLevelDeviceDataDto $
Current% ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
=; <
default= D
!D E
;E F
} 
public 

class )
DynamicAlarmEvaluationRequest .
{ 
public 
string 
Type 
{ 
get  
;  !
set" %
;% &
}' (
=) *
$str+ 4
;4 5
public  
DynamicDeviceDataDto #
Previous$ ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
=; <
default= D
!D E
;E F
public  
DynamicDeviceDataDto #
Current$ +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
=: ;
default< C
!C D
;D E
} 
} 