Õ
óC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Interfaces\IDynamicDataHelper.cs
	namespace		 	
Application		
 
.		 

Interfaces		  
{

 
public 

	interface 
IDynamicDataHelper '
{ 
string 
GetRandomStatus 
( 
)  
;  !
string !
GetRandomConnectivity $
($ %
)% &
;& '
public 
JsonNode .
"GenerateDynamicDataFromObservables :
(: ;
JsonNode; C
?C D
currentDataE P
,P Q
JsonNodeR Z
?Z [
dynamicObservables\ n
)n o
;o p
} 
} £
ôC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Interfaces\IDeviceServiceHelper.cs
	namespace 	
Application
 
. 

Interfaces  
{ 
public 

	interface  
IDeviceServiceHelper )
{ 
public !
TopLevelDeviceDataDto $
ExtractTopLevelDto% 7
(7 8
string8 >
macId? D
,D E
JsonNodeF N
rootNodeO W
)W X
;X Y
public  
DynamicDeviceDataDto #
ExtractDynamicDto$ 5
(5 6
string6 <
macId= B
,B C
JsonNodeD L
rootNodeM U
)U V
;V W
public 
JsonNode #
UpdateDynamicProperties /
(/ 0
JsonNode0 8
?8 9
currentData: E
,E F
JsonNodeG O
?O P
dynamicObservablesQ c
)c d
;d e
public 
Task 
WriteJsonFileAsync &
(& '
string' -
path. 2
,2 3
JsonNode4 <
rootNode= E
)E F
;F G
public 
Task (
BroadcastDeviceDetailUpdates 0
(0 1
List1 5
<5 6
(6 7
string7 =
MacId> C
,C D
stringE K
	EventNameL U
,U V
JsonElementW b
DetailPayloadc p
)p q
>q r
updatess z
)z {
;{ |
public 
Task $
BroadcastTopLevelSummary ,
(, -
List- 1
<1 2
(2 3
DeviceMetadata3 A
deviceB H
,H I
ListJ N
<N O
stringO U
>U V
updatedFieldsW d
)d e
>e f

allDevicesg q
)q r
;r s
} 
} 
ìC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Interfaces\IDeviceService.cs
	namespace 	
Application
 
. 

Interfaces  
{ 
public 

	interface 
IDeviceService #
{ 
public		 
List		 
<		 
DeviceMetadata		 "
>		" #)
GetAllDeviceMetadataPaginated		$ A
(		A B
List		B F
<		F G
DeviceMetadata		G U
>		U V
metadata		W _
,		_ `
int		a d

pageNumber		e o
=		p q
$num		r s
,		s t
int		u x
pageSize			y Å
=
		Ç É
$num
		Ñ Ü
)
		Ü á
;
		á à
public /
#DeviceMetadataPaginatedandSortedDto 22
&GetAllDeviceMetadataPaginatedandSorted3 Y
(Y Z%
DeviceTopLevelSortOptionsZ s
sortRequestt 
,	 Ä
List
Å Ö
<
Ö Ü
DeviceMetadata
Ü î
>
î ï
filteredData
ñ ¢
=
£ §
null
• ©
)
© ™
;
™ ´
public /
#DeviceMetadataPaginatedandSortedDto 2 
GetAllDeviceMetadata3 G
(G H
)H I
;I J
public /
#DeviceMetadataPaginatedandSortedDto 2.
"GetSearchedDeviceMetadataPaginated3 U
(U V%
DeviceTopLevelSortOptionsV o
sortRequestp {
,{ |
string	} É
input
Ñ â
=
â ä
$str
ä å
)
å ç
;
ç é
public 

Dictionary 
< 
string  
,  !
string" (
>( )!
GetMacIdToFileNameMap* ?
(? @
)@ A
;A B
public 
Task 
< 
DeviceDetails !
>! ")
GetPropertyPanelDataForDevice# @
(@ A
stringA G
deviceFileNameH V
)V W
;W X
public 
Task 
< 
bool 
> 1
%GenerateAndSendLiveUpdatesDevicesData ?
(? @
)@ A
;A B
public 
Task 
< 
bool 
> 3
'SimulateDynamicPropertiesUpdateForBatch A
(A B
)B C
;C D
public 
Task 
< 
bool 
> .
"SimulateTopLevelChangeForOneDevice <
(< =
)= >
;> ?
public 
Task 
< 
List 
< 
DevicesNameMacIdDto ,
>, -
>- .#
GetDevicesNameMacIdList/ F
(F G
)G H
;H I
public 
Task 
< 
string 
> 

UploadFile &
(& '
	IFormFile' 0
file1 5
)5 6
;6 7
public 
Task 
< /
#DeviceMetadataPaginatedandSortedDto 7
>7 8)
GetAllDataRefereshedFromCache9 V
(V W%
DeviceTopLevelSortOptionsW p
requestq x
,x y
string	z Ä
input
Å Ü
)
Ü á
;
á à
}   
}!! ‚
òC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Interfaces\IAlarmToggleService.cs
	namespace 	
Application
 
. 
	Interface 
{ 
public		 

	interface		 
IAlarmToggleService		 (
{

 
bool 
IsAlarmEnabled 
{ 
get !
;! "
}# $
void 
SetAlarmEnabled 
( 
bool !
enabled" )
)) *
;* +
} 
} ∞
úC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Interfaces\IAlarmEvaluationService.cs
	namespace 	
Application
 
. 

Interfaces  
{		 
public

 

	interface

 #
IAlarmEvaluationService

 ,
{ 
Task 
EvaluateTopAsync 
( !
TopLevelDeviceDataDto 3
previous4 <
,< =!
TopLevelDeviceDataDto> S
currentT [
)[ \
;\ ]
Task  
EvaluateDynamicAsync !
(! " 
DynamicDeviceDataDto" 6
previous7 ?
,? @ 
DynamicDeviceDataDtoA U
currentV ]
)] ^
;^ _
Task 
AddAlarmRules 
( 
string !
deviceMacId" -
,- .
List/ 3
<3 4
AlarmRuleDto4 @
>@ A

alarmRulesB L
)L M
;M N
} 
} õ
òC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\ObservableFieldDEfination.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 %
ObservableFieldDefinition		 *
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
$str+ -
;- .
public 
double 
? 
Min 
{ 
get  
;  !
set" %
;% &
}' (
public 
double 
? 
Max 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
? 
Unit 
{ 
get !
;! "
set# &
;& '
}( )
public 
List 
< 
string 
> 
? 
Values #
{$ %
get& )
;) *
set+ .
;. /
}0 1
public 
int 
? 
Count 
{ 
get 
;  
set! $
;$ %
}& '
public 
string 
? 
Prefix 
{ 
get  #
;# $
set% (
;( )
}* +
public 
double 
? 
Probability "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
List 
< 
double 
> 
? 
Weights $
{% &
get' *
;* +
set, /
;/ 0
}1 2
public 
string 
? 
Formula 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 

Dictionary 
< 
string  
,  !%
ObservableFieldDefinition" ;
>; <
?< =
Children> F
{G H
getI L
;L M
setN Q
;Q R
}S T
} 
} ©	
êC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\LiveDeviceDataDto.cs
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
} “
ëC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\LiveDataExtractDto.cs
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
} Ÿ
òC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceTopLevelSortOptions.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 %
DeviceTopLevelSortOptions		 *
{

 
public 
int 

PageNumber 
{ 
get  #
;# $
set% (
;( )
}* +
=, -
$num. /
;/ 0
public 
int 
PageSize 
{ 
get !
;! "
set# &
;& '
}( )
=* +
$num, .
;. /
public 
List 
< 

SortOption 
> 
Sorting  '
{( )
get* -
;- .
set/ 2
;2 3
}4 5
=6 7
new8 ;
(; <
)< =
;= >
} 
public 

class 

SortOption 
{ 
public 
string 
Id 
{ 
get 
; 
set  #
;# $
}% &
=' (
$str) +
;+ ,
public 
bool 
Desc 
{ 
get 
; 
set  #
;# $
}% &
} 
} Ó
ïC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceTopLevelLiveData.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 #
DevicesTopLevelLiveData		 (
{

 
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
MacId 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
LastUpdated $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} ï

ëC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceTopLevelData.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
DeviceTopLevelData		 #
{

 
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Type 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
MacId 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
LastUpdated $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} ¥
ìC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceStorageOptions.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		  
DeviceStorageOptions		 %
{

 
public 
bool 
UseDatabase 
{  !
get" %
;% &
set' *
;* +
}, -
=. /
false0 5
;5 6
} 
} Ì
ñC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceMetadataPaginated.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public 

class /
#DeviceMetadataPaginatedandSortedDto 4
{ 
public 
int 

TotalCount 
{ 
get  #
;# $
set% (
;( )
}* +
public 
List 
< 
DeviceMetadata "
>" #
DeviceMetadata$ 2
{3 4
get5 8
;8 9
set: =
;= >
}? @
} 
}		 …
ìC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceServiceOptions.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		  
DeviceServiceOptions		 %
{

 
public 
string 
DataDirectory #
{$ %
get& )
;) *
set+ .
;. /
}0 1
=2 3
default4 ;
!; <
;< =
} 
} °
íC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DevicesNameMacIdDto.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
DevicesNameMacIdDto		 $
{

 
public 
string 

DeviceName  
{! "
get# &
;& '
set( +
;+ ,
}- .
public 
string 
DeviceMacId !
{" #
get$ '
;' (
set) ,
;, -
}. /
} 
} ©
çC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceMetadata.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 
DeviceMetadata		 
{

 
public 
string 
FileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Type 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
MacId 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
DateTime 
? 
LastUpdated $
{% &
get' *
;* +
set, /
;/ 0
}1 2
} 
} …
åC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\DeviceDetails.cs
	namespace 	
Domain
 
. 
Entities 
{		 
public

 

class

 
DeviceDetails

 
{ 
public 
string 
FileName 
{  
get! $
;$ %
set& )
;) *
}+ ,
public 
string 
Name 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Type 
{ 
get  
;  !
set" %
;% &
}' (
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
public 
string 
MacId 
{ 
get !
;! "
set# &
;& '
}( )
public 
string 
Connectivity "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
JsonElement 
StaticProperties +
{, -
get. 1
;1 2
set3 6
;6 7
}8 9
public 
JsonElement 
DynamicProperties ,
{- .
get/ 2
;2 3
set4 7
;7 8
}9 :
} 
} ∫
ãC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\AlarmRuleDto.cs
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
} ª
ïC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Application\Dtos\AlarmEvaluationRequest.cs
	namespace 	
Application
 
. 
Dtos 
{ 
public		 

class		 "
AlarmEvaluationRequest		 '
{

 
public 
LiveDeviceDataDto  
Previous! )
{* +
get, /
;/ 0
set1 4
;4 5
}6 7
=8 9
default: A
!A B
;B C
public 
LiveDeviceDataDto  
Current! (
{) *
get+ .
;. /
set0 3
;3 4
}5 6
=7 8
default9 @
!@ A
;A B
} 
} 