#pragma strict

//OBSOLETE
//SERVER


var maxSpeed:float;//absolute acceleration limit
var speed:float;//percentage of maxspeed (0-1)
var username:String; //unique string identifying this manager
var client:NetworkPlayer;

private var started:boolean = false;


function Initialize () {
	if (Network.isClient) return;
	Debug.Log("Server initialized player");
	started = true;
}

function Update () {

	if (Network.isClient || !started) return;
	
	rigidbody.AddForce((maxSpeed*speed)*transform.forward);
	
}


function OnClientConnected(player: NetworkPlayer){
	
	if (player != client) return;
	Debug.Log("Enabling " + username + "'s controls");
	networkView.RPC("Enable",client);
	networkView.RPC("SetValues",client,speed,maxSpeed,username);
}

@RPC
public function updateServerSpeed(speed:float){
	this.speed = speed;
	Debug.Log("Server speed" + speed);
}