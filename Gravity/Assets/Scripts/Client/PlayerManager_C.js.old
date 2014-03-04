#pragma strict

//CLIENT


var sldSpeedX:int=10;
var sldSpeedY:int=10;
var sldSpeedW:int=30;
var sldSpeedH:int=100;


var speed:float = 0;//percentage of maxspeed (0-1)
var speed_old:float = 1;

var maxSpeed:float = 0;
var username:String = "";

private var unlocked:boolean = false;


function OnNetworkLoadedLevel () {
	if (Network.isServer) return;
}

@RPC
function SetValues(speed:float,maxSpeed:float,username:String){
	
	Debug.Log("Variables set by server");
	this.username = username;
	this.speed = speed;
	this.maxSpeed = maxSpeed;
}

@RPC
function Enable(){
	//means this client is owner now
	Debug.Log("Controls enabled");
	Camera.current.gameObject.GetComponent(MouseOrbit).target = transform;
	rigidbody.interpolation = RigidbodyInterpolation.Interpolate;
	unlocked = true;
}

function OnGUI(){
	if (Network.isServer || !unlocked) return;
	speed = GUI.VerticalSlider(new Rect(sldSpeedX,sldSpeedY,sldSpeedW,sldSpeedH),speed,0f,1f);
	
}

function Update () {
	if (Network.isServer || !unlocked) return;
	
	if (speed_old != speed){
		networkView.RPC("updateServerSpeed",RPCMode.Server,speed);
		speed_old = speed;
	}
	
	//to reduce lag do same as server
	rigidbody.AddForce((maxSpeed*speed)*transform.forward);
}