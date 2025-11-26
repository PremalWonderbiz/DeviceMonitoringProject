„2
yC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\API\Program.cs
var 
builder 
= 
WebApplication 
. 
CreateBuilder *
(* +
args+ /
)/ 0
;0 1
builder 
. 
Services 
. 
	Configure 
<  
DeviceServiceOptions /
>/ 0
(0 1
builder 
. 
Configuration 
. 

GetSection $
($ %
$str% ;
); <
)< =
;= >
builder 
. 
Services 
. 
	Configure 
<  
DeviceStorageOptions /
>/ 0
(0 1
builder 
. 
Configuration 
. 

GetSection $
($ %
$str% ;
); <
)< =
;= >
builder 
. 
Services 
. 
AddControllers 
(  
)  !
;! "
var 
dbPath 

= 
$str |
;| }
builder 
. 
Services 
. 
AddDbContext 
< 
DeviceDbContext -
>- .
(. /
options/ 6
=>7 9
options   
.   
	UseSqlite   
(   
$"   
$str   $
{  $ %
dbPath  % +
}  + ,
$str  , F
"  F G
)  G H
)  H I
;  I J
builder"" 
."" 
Services"" 
."" #
AddEndpointsApiExplorer"" (
(""( )
)"") *
;""* +
builder## 
.## 
Services## 
.## 
AddSwaggerGen## 
(## 
)##  
;##  !
builder$$ 
.$$ 
Services$$ 
.$$ 
AddHostedService$$ !
<$$! "#
DeviceLiveDataBgService$$" 9
>$$9 :
($$: ;
)$$; <
;$$< =
builder%% 
.%% 
Services%% 
.%% 
	AddScoped%% 
<%% 
IDeviceService%% )
,%%) *
DeviceService%%+ 8
>%%8 9
(%%9 :
)%%: ;
;%%; <
builder&& 
.&& 
Services&& 
.&& 
	AddScoped&& 
<&& 
IDynamicDataHelper&& -
,&&- .
DynamicDataHelper&&/ @
>&&@ A
(&&A B
)&&B C
;&&C D
builder'' 
.'' 
Services'' 
.'' 
	AddScoped'' 
<''  
IDeviceServiceHelper'' /
,''/ 0
DeviceServiceHelper''1 D
>''D E
(''E F
)''F G
;''G H
builder(( 
.(( 
Services(( 
.(( 
	AddScoped(( 
<(( #
IAlarmEvaluationService(( 2
,((2 3"
AlarmEvaluationService((4 J
>((J K
(((K L
)((L M
;((M N
builder)) 
.)) 
Services)) 
.)) 
AddHttpClient)) 
<)) #
IAlarmEvaluationService)) 6
,))6 7"
AlarmEvaluationService))8 N
>))N O
())O P
client))P V
=>))W Y
{** 
client,, 

.,,
 
BaseAddress,, 
=,, 
new,, 
Uri,,  
(,,  !
$str,,! 9
),,9 :
;,,: ;
}// 
)// 
;// 
builder11 
.11 
Services11 
.11 
AddHttpClient11 
(11 
)11  
;11  !
builder33 
.33 
Services33 
.33 
AddCors33 
(33 
options33  
=>33! #
{44 
options55 
.55 
	AddPolicy55 
(55 
$str55 "
,55" #
policy66 
=>66 
policy66 
.77 
AllowAnyMethod77 
(77 
)77 
.88 
AllowAnyHeader88 
(88 
)88 
.99 
SetIsOriginAllowed99 
(99  
_99  !
=>99" $
true99% )
)99) *
.:: 
AllowCredentials:: 
(:: 
):: 
)::  
;::  !
};; 
);; 
;;; 
builder>> 
.>> 
Services>> 
.>> 
AddSingleton>> 
<>> 
DeviceStateCache>> .
>>>. /
(>>/ 0
)>>0 1
;>>1 2
builder?? 
.?? 
Services?? 
.?? 
AddSingleton?? 
<?? 
IAlarmToggleService?? 1
,??1 2
AlarmToggleService??3 E
>??E F
(??F G
)??G H
;??H I
builder@@ 
.@@ 
Services@@ 
.@@ 
AddHostedService@@ !
<@@! ")
DeviceStatePersistenceService@@" ?
>@@? @
(@@@ A
)@@A B
;@@B C
varBB 
appBB 
=BB 	
builderBB
 
.BB 
BuildBB 
(BB 
)BB 
;BB 
ifEE 
(EE 
appEE 
.EE 
EnvironmentEE 
.EE 
IsDevelopmentEE !
(EE! "
)EE" #
)EE# $
{FF 
appGG 
.GG 

UseSwaggerGG 
(GG 
)GG 
;GG 
appHH 
.HH 
UseSwaggerUIHH 
(HH 
)HH 
;HH 
}II 
appKK 
.KK 
UseMiddlewareKK 
<KK 
ExceptionMiddlewareKK %
>KK% &
(KK& '
)KK' (
;KK( )
appMM 
.MM 
UseHttpsRedirectionMM 
(MM 
)MM 
;MM 
appOO 
.OO 
UseAuthorizationOO 
(OO 
)OO 
;OO 
appQQ 
.QQ 
MapControllersQQ 
(QQ 
)QQ 
;QQ 
appSS 
.SS 
UseCorsSS 
(SS 
$strSS 
)SS 
;SS 
awaitUU 
appUU 	
.UU	 

RunAsyncUU
 
(UU 
)UU 
;UU Ì
êC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\API\Middleware\ExceptionMiddleware.cs
	namespace 	
API
 
. 

Middleware 
{ 
public 

class 
ExceptionMiddleware $
{ 
private 
readonly 
RequestDelegate (
_next) .
;. /
public

 
ExceptionMiddleware

 "
(

" #
RequestDelegate

# 2
next

3 7
)

7 8
{ 	
_next 
= 
next 
; 
} 	
public 
async 
Task 
InvokeAsync %
(% &
HttpContext& 1
context2 9
)9 :
{ 	
try 
{ 
await 
_next 
( 
context #
)# $
;$ %
} 
catch 
( 
CustomException "
ex# %
)% &
{ 
await  
HandleExceptionAsync *
(* +
context+ 2
,2 3
ex4 6
,6 7
ex8 :
.: ;

StatusCode; E
)E F
;F G
} 
catch 
( 
	Exception 
ex 
)  
{ 
await  
HandleExceptionAsync *
(* +
context+ 2
,2 3
ex4 6
,6 7
$num8 ;
); <
;< =
} 
} 	
private 
async 
Task  
HandleExceptionAsync /
(/ 0
HttpContext0 ;
context< C
,C D
	ExceptionE N
exO Q
,Q R
intS V

statusCodeW a
)a b
{   	
context!! 
.!! 
Response!! 
.!! 

StatusCode!! '
=!!( )

statusCode!!* 4
;!!4 5
context"" 
."" 
Response"" 
."" 
ContentType"" (
="") *
$str""+ =
;""= >
string$$ 
json$$ 
=$$ 
JsonSerializer$$ (
.$$( )
	Serialize$$) 2
($$2 3
ex$$3 5
.$$5 6
Message$$6 =
)$$= >
;$$> ?
await%% 
context%% 
.%% 
Response%% "
.%%" #

WriteAsync%%# -
(%%- .
json%%. 2
)%%2 3
;%%3 4
}&& 	
}'' 
}(( Æf
éC:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\API\Controllers\DeviceController.cs
	namespace 	
API
 
. 
Controllers 
{ 
[		 
Route		 

(		
 
$str		 
)		 
]		 
[

 
ApiController

 
]

 
public 

class 
DevicesController "
:# $
ControllerBase% 3
{ 
private 
readonly 
IDeviceService '
_deviceService( 6
;6 7
private 
readonly 
IAlarmToggleService ,
_toggleService- ;
;; <
public 
DevicesController  
(  !
IDeviceService! /
deviceService0 =
,= >
IAlarmToggleService? R
toggleServiceS `
)` a
{ 	
_deviceService 
= 
deviceService *
;* +
_toggleService 
= 
toggleService *
;* +
} 	
[ 	
HttpPost	 
( 
$str +
)+ ,
], -
public 
IActionResult .
"GetSearchedDeviceMetadataPaginated ?
(? @%
DeviceTopLevelSortOptions@ Y
optionsZ a
,a b
stringc i
inputj o
=o p
$strp r
)r s
{ 	
var 
data 
= 
_deviceService %
.% &.
"GetSearchedDeviceMetadataPaginated& H
(H I
optionsI P
,P Q
inputR W
)W X
;X Y
var 
formattedData 
= 
data  $
.$ %
DeviceMetadata% 3
.3 4
Select4 :
(: ;
m; <
=>= ?
new@ C
DeviceTopLevelDataD V
{ 
Name 
= 
m 
. 
Name 
, 
Type 
= 
m 
. 
Type 
, 
Status 
= 
m 
. 
Status !
,! "
MacId   
=   
m   
.   
MacId   
,    
Connectivity!! 
=!! 
m!!  
.!!  !
Connectivity!!! -
}"" 
)"" 
."" 
ToList"" 
("" 
)"" 
;"" 
return$$ 
Ok$$ 
($$ 
new$$ 
{%% 

totalCount&& 
=&& 
data&& !
.&&! "

TotalCount&&" ,
,&&, -
data'' 
='' 
formattedData'' $
}(( 
)(( 
;(( 
})) 	
[++ 	
HttpPost++	 
(++ 
$str++ 
)++ 
]++ 
public,, 
IActionResult,, /
#GetDeviceMetadataPaginatedandSorted,, @
(,,@ A%
DeviceTopLevelSortOptions,,A Z
request,,[ b
),,b c
{-- 	
var.. 
data.. 
=.. 
_deviceService.. %
...% &2
&GetAllDeviceMetadataPaginatedandSorted..& L
(..L M
request..M T
)..T U
;..U V
var00 
formattedData00 
=00 
data00  $
.00$ %
DeviceMetadata00% 3
.003 4
Select004 :
(00: ;
m00; <
=>00= ?
new00@ C
DeviceTopLevelData00D V
{11 
Name22 
=22 
m22 
.22 
Name22 
,22 
Type33 
=33 
m33 
.33 
Type33 
,33 
Status44 
=44 
m44 
.44 
Status44 !
,44! "
MacId55 
=55 
m55 
.55 
MacId55 
,55  
Connectivity66 
=66 
m66  
.66  !
Connectivity66! -
,66- .
LastUpdated77 
=77 
m77 
.77  
LastUpdated77  +
}88 
)88 
.88 
ToList88 
(88 
)88 
;88 
return:: 
Ok:: 
(:: 
new:: 
{;; 

totalCount<< 
=<< 
data<< !
.<<! "

TotalCount<<" ,
,<<, -
data== 
=== 
formattedData== $
}>> 
)>> 
;>> 
}?? 	
[AA 	
HttpPostAA	 
(AA 
$strAA 
)AA  
]AA  !
publicBB 
IActionResultBB 
GetDeviceMetadataBB .
(BB. /
)BB/ 0
{CC 	
varDD 
dataDD 
=DD 
_deviceServiceDD %
.DD% & 
GetAllDeviceMetadataDD& :
(DD: ;
)DD; <
;DD< =
varFF 
formattedDataFF 
=FF 
dataFF  $
.FF$ %
DeviceMetadataFF% 3
.FF3 4
SelectFF4 :
(FF: ;
mFF; <
=>FF= ?
newFF@ C
DeviceTopLevelDataFFD V
{GG 
NameHH 
=HH 
mHH 
.HH 
NameHH 
,HH 
TypeII 
=II 
mII 
.II 
TypeII 
,II 
StatusJJ 
=JJ 
mJJ 
.JJ 
StatusJJ !
,JJ! "
MacIdKK 
=KK 
mKK 
.KK 
MacIdKK 
,KK  
ConnectivityLL 
=LL 
mLL  
.LL  !
ConnectivityLL! -
,LL- .
LastUpdatedMM 
=MM 
mMM 
.MM  
LastUpdatedMM  +
}NN 
)NN 
.NN 
ToListNN 
(NN 
)NN 
;NN 
returnPP 
OkPP 
(PP 
newPP 
{QQ 

totalCountRR 
=RR 
dataRR !
.RR! "

TotalCountRR" ,
,RR, -
dataSS 
=SS 
formattedDataSS $
}TT 
)TT 
;TT 
}UU 	
[WW 	
HttpPostWW	 
(WW 
$strWW (
)WW( )
]WW) *
publicXX 
asyncXX 
TaskXX 
<XX 
IActionResultXX '
>XX' (
GetRefreshedDataXX) 9
(XX9 :%
DeviceTopLevelSortOptionsXX: S
requestXXT [
,XX[ \
stringXX] c
inputXXd i
=XXj k
$strXXl n
)XXn o
{YY 	
varZZ 
dataZZ 
=ZZ 
awaitZZ 
_deviceServiceZZ +
.ZZ+ ,)
GetAllDataRefereshedFromCacheZZ, I
(ZZI J
requestZZJ Q
,ZZQ R
inputZZS X
)ZZX Y
;ZZY Z
var\\ 
formattedData\\ 
=\\ 
data\\  $
.\\$ %
DeviceMetadata\\% 3
.\\3 4
Select\\4 :
(\\: ;
m\\; <
=>\\= ?
new\\@ C
DeviceTopLevelData\\D V
{]] 
Name^^ 
=^^ 
m^^ 
.^^ 
Name^^ 
,^^ 
Type__ 
=__ 
m__ 
.__ 
Type__ 
,__ 
Status`` 
=`` 
m`` 
.`` 
Status`` !
,``! "
MacIdaa 
=aa 
maa 
.aa 
MacIdaa 
,aa  
Connectivitybb 
=bb 
mbb  
.bb  !
Connectivitybb! -
,bb- .
LastUpdatedcc 
=cc 
mcc 
.cc  
LastUpdatedcc  +
}dd 
)dd 
.dd 
ToListdd 
(dd 
)dd 
;dd 
returnff 
Okff 
(ff 
newff 
{gg 

totalCounthh 
=hh 
datahh !
.hh! "

TotalCounthh" ,
,hh, -
dataii 
=ii 
formattedDataii $
}jj 
)jj 
;jj 
}kk 	
[mm 	
HttpGetmm	 
(mm 
$strmm *
)mm* +
]mm+ ,
publicnn 
asyncnn 
Tasknn 
<nn 
IActionResultnn '
>nn' (#
GetDevicesNameMacIdListnn) @
(nn@ A
)nnA B
{oo 	
varpp 
datapp 
=pp 
awaitpp 
_deviceServicepp +
.pp+ ,#
GetDevicesNameMacIdListpp, C
(ppC D
)ppD E
;ppE F
returnrr 
Okrr 
(rr 
datarr 
)rr 
;rr 
}ss 	
[uu 	
HttpGetuu	 
(uu 
$struu (
)uu( )
]uu) *
publicvv 
asyncvv 
Taskvv 
<vv 
IActionResultvv '
>vv' (!
GetMacIdToFileNameMapvv) >
(vv> ?
)vv? @
{ww 	
varxx 
resxx 
=xx 
_deviceServicexx $
.xx$ %!
GetMacIdToFileNameMapxx% :
(xx: ;
)xx; <
;xx< =
returnyy 
Okyy 
(yy 
resyy 
)yy 
;yy 
}zz 	
[|| 	
HttpGet||	 
(|| 
$str|| 4
)||4 5
]||5 6
public}} 
async}} 
Task}} 
<}} 
IActionResult}} '
>}}' ()
GetPropertyPanelDataForDevice}}) F
(}}F G
string}}G M

devicename}}N X
)}}X Y
{~~ 	
try 
{
ÄÄ 
var
ÅÅ 
res
ÅÅ 
=
ÅÅ 
await
ÅÅ 
_deviceService
ÅÅ  .
.
ÅÅ. /+
GetPropertyPanelDataForDevice
ÅÅ/ L
(
ÅÅL M

devicename
ÅÅM W
)
ÅÅW X
;
ÅÅX Y
return
ÉÉ 
Ok
ÉÉ 
(
ÉÉ 
res
ÉÉ 
)
ÉÉ 
;
ÉÉ 
}
ÑÑ 
catch
ÖÖ 
(
ÖÖ 
	Exception
ÖÖ 
ex
ÖÖ 
)
ÖÖ  
{
ÜÜ 
return
áá 

StatusCode
áá !
(
áá! "
$num
áá" %
,
áá% &
$"
áá' )
$str
áá) J
{
ááJ K

devicename
ááK U
}
ááU V
$str
ááV X
{
ááX Y
ex
ááY [
.
áá[ \
Message
áá\ c
}
áác d
"
áád e
)
ááe f
;
ááf g
}
àà 
}
ää 	
[
åå 	
HttpPost
åå	 
(
åå 
$str
åå 
)
åå 
]
åå  
public
çç 
async
çç 
Task
çç 
<
çç 
IActionResult
çç '
>
çç' (

UploadFile
çç) 3
(
çç3 4
	IFormFile
çç4 =
file
çç> B
)
ççB C
{
éé 	
var
èè 
res
èè 
=
èè 
await
èè 
_deviceService
èè *
.
èè* +

UploadFile
èè+ 5
(
èè5 6
file
èè6 :
)
èè: ;
;
èè; <
return
ëë 
Ok
ëë 
(
ëë 
new
ëë 
{
ëë 
message
ëë #
=
ëë$ %
res
ëë& )
,
ëë) *
fileName
ëë+ 3
=
ëë4 5
file
ëë6 :
.
ëë: ;
FileName
ëë; C
}
ëëD E
)
ëëE F
;
ëëF G
}
íí 	
[
ïï 	
HttpGet
ïï	 
(
ïï 
$str
ïï 
)
ïï 
]
ïï  
public
ññ 
IActionResult
ññ 
GetAlarmToggle
ññ +
(
ññ+ ,
)
ññ, -
{
óó 	
var
òò 
res
òò 
=
òò 
_toggleService
òò $
.
òò$ %
IsAlarmEnabled
òò% 3
;
òò3 4
return
ôô 
Ok
ôô 
(
ôô 
new
ôô 
{
ôô 
AlarmEnabled
ôô (
=
ôô) *
res
ôô+ .
}
ôô/ 0
)
ôô0 1
;
ôô1 2
}
öö 	
[
úú 	
HttpPost
úú	 
(
úú 
$str
úú )
)
úú) *
]
úú* +
public
ùù 
IActionResult
ùù 
SetAlarmToggle
ùù +
(
ùù+ ,
bool
ùù, 0
enabled
ùù1 8
)
ùù8 9
{
ûû 	
_toggleService
üü 
.
üü 
SetAlarmEnabled
üü *
(
üü* +
enabled
üü+ 2
)
üü2 3
;
üü3 4
return
†† 
Ok
†† 
(
†† 
new
†† 
{
†† 
AlarmEnabled
†† (
=
††) *
enabled
††+ 2
}
††3 4
)
††4 5
;
††5 6
}
°° 	
}
££ 
}§§ 