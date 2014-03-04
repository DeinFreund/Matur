#pragma strict
var winRect: Rect = Rect(50,50,200,200);
var btnMaximized :Rect = Rect(5,5,20,10);
var winMaximized: boolean = true;
var sldSpeedRect: Rect = Rect(10,10,20,100);

private var accel: float = 0;
private var oldaccel: float = 1;
private var isOwner:boolean = false;
private var maxAccel:float = 0;

function OnNetworkLoadedLevel () {

	if (!Network.isClient){
		this.enabled = false;
	}
}

@RPC
function SetValues(maxAccel : float){
	this.maxAccel = maxAccel;
}

@RPC
function Enable(){
	Debug.Log("Engine controls enabled");
	isOwner = true;
}

function Update () {


	transform.parent.rigidbody.AddForceAtPosition(transform.forward * 1 *  accel * maxAccel * Time.deltaTime,transform.localPosition + transform.parent.position);
	
	if (!isOwner) return;
	if (accel != oldaccel){
		networkView.RPC("SetAcceleration",RPCMode.Server,accel);
		oldaccel = accel;
	}
	//smoothing
	
	
}

function OnGUI(){
	if (!isOwner) return;
	
	winRect = GUI.Window(networkView.GetInstanceID(),winRect,OnWindow,"Engine");
}

function OnWindow(winId:int){
	
	if (GUI.Button(btnMaximized,"click")){
		winMaximized = !winMaximized;
		if (winMaximized){
		winRect.height = 200;
		}else
		{
		winRect.height = 50;
		}
	}
	accel = GUI.VerticalSlider(sldSpeedRect,accel,1,0);
	GUI.DragWindow ();
}
