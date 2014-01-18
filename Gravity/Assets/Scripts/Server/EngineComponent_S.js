#pragma strict

var maxAccel: float=50000;
private var pmanager : PlayerManager_S;


var accel : float = 0;

function Start(){
	
}

function OnNetworkLoadedLevel () {

	if (!Network.isServer){
		this.enabled = false;
	}
	networkView.RPC("SetValues",RPCMode.OthersBuffered, maxAccel);	
}

function Update () {

	if (transform.parent == null) {
		this.enabled = false;//theres no engine without ship
		return;	
	}
	
	//Debug.Log("Engine speed: " + accel + " = " + transform.forward *  accel * maxAccel * Time.deltaTime);
	//Debug.Log(transform.forward);
	//this.gameObject.rigidbody.AddForce(transform.forward *  accel * maxAccel * Time.deltaTime);
	transform.parent.rigidbody.AddForceAtPosition(transform.forward * 1 *  accel * maxAccel * Time.deltaTime,transform.localPosition + transform.parent.position);
	//transform.parent.rigidbody.AddForce(transform.forward * 1 *  accel * maxAccel * Time.deltaTime);
}

@RPC
function SetAcceleration(val:float){
	if (val < 0 || val > 1) {
		Debug.Log("Invalid engine acceleration: "  + val+ ". Should be between 0 and 1.");
	}
	accel = val;
	//Debug.Log("Updating engine speed: " + accel);
}

function SetOwner(pmanager: PlayerManager_S){
	this.pmanager = pmanager;
	Debug.Log("Got Owner of Engine Component: " + this.pmanager.username);
}



function OnClientConnected(client : NetworkPlayer){
	//solved Debug.Log(pmanager);// Y U NULLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
	if(pmanager.client==null || pmanager.client != client) return;
	
	networkView.RPC("Enable",pmanager.client);
	
}