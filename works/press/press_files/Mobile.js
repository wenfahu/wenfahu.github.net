function addMobile()
{
	$("#game").css("left", "0");
	$("#game").css("top", "0");
	$("#game").css("margin", "0");	
	$("#game,#GameFrame,html,body").css("width", "100%");
	$("#game,#GameFrame,html,bodycss ").css("height", "100%");


	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);  
    
	if (window.DeviceOrientationEvent)
	  window.addEventListener('deviceorientation', devOrientHandler, false);
}


//Mobile Handlers
function devOrientHandler(eventData) 
{
	// gamma is the left-to-right tilt in degrees, where right is positive
	var tiltLR = eventData.gamma;
	
	// beta is the front-to-back tilt in degrees, where front is positive
	var tiltFB = eventData.beta;
	
	// alpha is the compass direction the device is facing in degrees
	var dir = eventData.alpha
	
	// deviceorientation does not provide this data
	var motUD = null;

	//console.log(tiltLR);
	if (tiltLR<-3)
	{
		players[1].left=true;
		players[1].right=false;
	}
	else if (tiltLR>3)
	{
		players[1].left=false;
		players[1].right=true;
	}
	else
	{
		players[1].right=false;
		players[1].right=false;
	}
}

$(document).mousedown(function(e)
{
	anyKey=true;
	players[1].up=true;
	
});

$(document).mouseup(function(e)
{
	players[1].up=false;
	
});

function touchHandler(event)
{
  var touches = event.changedTouches,
      first = touches[0],
      type = "";
       switch(event.type)
  {
      case "touchstart": type = "mousedown"; break;
      case "touchmove":  type="mousedown"; break;        
      case "touchend":   type="mouseup"; break;
      default: return;
  }

           //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
  //           screenX, screenY, clientX, clientY, ctrlKey, 
  //           altKey, shiftKey, metaKey, button, relatedTarget);
  
  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                            first.screenX, first.screenY, 
                            first.clientX, first.clientY, false, 
                            false, false, false, 0/*left*/, null);

first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}