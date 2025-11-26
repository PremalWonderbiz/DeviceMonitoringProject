÷
“C:\Users\Premal Kadam\Documents\Device Monitoring Project\DeviceMonitoring\Backend\DeviceMonitoringProject\Common\Helper Classes\CustomException.cs
	namespace 	
Common
 
. 
Helper_Classes 
{ 
public		 

class		 
CustomException		  
:		! "
	Exception		# ,
{

 
public 
int 

StatusCode 
{ 
get  #
;# $
}% &
public 
CustomException 
( 
int "

statusCode# -
,- .
string/ 5
message6 =
)= >
: 
base 
( 
message 
) 
{ 	

StatusCode 
= 

statusCode #
;# $
} 	
} 
} 