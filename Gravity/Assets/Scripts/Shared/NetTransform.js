#pragma strict

private var rpcFreq : float = 6;
private var accFreq : float = 20;
private var lastRPC : float;
private var lastAcc : float;
private var lastSpeed : Vector3;
private var accel : Vector3 = Vector3.zero;

/*private static var instances : List.<NetTransform> = new List.<NetTransform>();

function Start(){
	instances.Add(this);
}

static function InitAll(){
	for (var nt : NetTransform in instances){
		nt.Init();
	}
}*/

function Start() {
	if (Network.isServer){
		lastRPC = Time.time;
		InvokeRepeating("UpdateRemote",1f/rpcFreq,1f/rpcFreq);
		lastSpeed = rigidbody.velocity;
	}else{
		InvokeRepeating("ApplyAccel",1f/accFreq,1f/accFreq);
		lastAcc = Time.time;
	}
}


function UpdateRemote(){
	networkView.RPC("setVelocity", RPCMode.Others , transform.position,transform.rotation,rigidbody.velocity, rigidbody.angularVelocity, (rigidbody.velocity - lastSpeed) / (Time.time - lastRPC));
	lastSpeed = rigidbody.velocity;
	lastRPC = Time.time;
}

function ApplyAccel(){
	rigidbody.velocity += accel * (Time.time - lastAcc);
	lastAcc = Time.time;
}


@RPC
function setVelocity(pos : Vector3, rot : Quaternion, v : Vector3, vrot : Vector3, acc : Vector3){
	var fac = Mathf.Min(1f,Vector3.Distance(transform.position,pos)/10);
	transform.position = transform.position*(1-fac) + fac*pos;
	transform.rotation = Quaternion.Lerp(transform.rotation,rot,0.5);
	rigidbody.velocity = v;
	rigidbody.angularVelocity = vrot;
	accel /= 2f;
	accel += acc / 2f;
}