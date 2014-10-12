#pragma strict

var working : boolean = true;
var isActive : boolean = true;

var targetRot : Quaternion = new Quaternion();
var targetDir : Vector3 = new Vector3();

private var force : float = 30000;

private var velocityPID : PID3D = new PID3D(0.1,0,0.001);
private var targetPID : PID ;
private var rollPID : PID = new PID(0.1,0,0.0003);
private var used : float = 1f;

private var setAxis : Vector3 = Vector3.zero;

/*private static var instances : List.<SAS> = new List.<SAS>();

function Start(){
	instances.Add(this);
}

static function InitAll(){
	for (var sas : SAS in instances){
		sas.Init();
	}
}*/

function Start() {
	
	if (Network.isClient) enabled = false;
	targetPID = new PID(0.1/rigidbody.mass,0,0.003);
}


function Update () {
	if (targetPID == null) return; // not yet initialized
	addTorque(setAxis);
	if (working){
		/*var v = transform.rigidbody.angularVelocity;
		var amt : Vector3;
		i+= Time.deltaTime * v;
		amt = -mp*v - mi*i;
		Debug.Log(amt +  " - i: " + i);*/
		var pid0 = Vector3.ClampMagnitude(velocityPID.getCorrection(-transform.rigidbody.angularVelocity,Time.deltaTime),1f);
		
		/*var taxis : Vector3;
		var tangle : float;
		var caxis : Vector3;
		var cangle : float;
		targetRot.ToAngleAxis(tangle,taxis);
		transform.rotation.ToAngleAxis(cangle,caxis);*/
		var caxis = transform.forward;
		var taxis = targetDir;
		//Debug.DrawRay(transform.position,caxis*5,Color.blue,Time.deltaTime);
		//Debug.DrawRay(transform.position,taxis*5,Color.green,Time.deltaTime);
		//Debug.DrawRay(transform.position,5*Vector3.Cross(caxis,taxis)*Mathf.Min(1f,targetPID.getCorrection(Vector3.Angle(caxis,taxis),Time.deltaTime)),Color.red,Time.deltaTime);
		//Debug.Log("blun");
		var pid1 = Vector3.Cross(caxis,taxis).normalized*Mathf.Max(-1f,Mathf.Min(1f,targetPID.getCorrection(Vector3.Angle(caxis,taxis),Time.deltaTime)));
		//var pid2 = caxis.normalized*Mathf.Min(1f,rollPID.getCorrection(tangle-cangle,Time.deltaTime));
		//transform.rotation.eulerAngles += err.eulerAngles;
		var torque : Vector3;
		if (isActive){
			torque = (0.25*pid0+0.75*pid1);
		}else{
			torque = pid0;
		}
		torque *= 1000;
		if (torque.magnitude > 1) torque = torque.normalized;
		if (used > 0) rigidbody.AddTorque(used * torque*force * Time.deltaTime);
	}
	used = 1f;
}

function addTorque(axis : Vector3){
	addTorque(axis.magnitude,axis.normalized);
}
function addTorque(amt : float, axis : Vector3){
	if (used < Mathf.Abs(amt)) return;
	amt = Mathf.Clamp(amt,-1f,1f);
	used -= Mathf.Abs(amt);
	rigidbody.AddTorque(amt * force * Time.deltaTime * axis.normalized);
}


function enable(enable : boolean){
	working = enable;
}

function setActive(val : boolean){
	isActive = val;
}

function setPermanentTorque(torque : Vector3){
	setAxis = torque;
	if (torque.magnitude > 0){
		working = false;
	}else{
		working = true;
		setTargetDir(transform.forward);
	}
}

function getTargetDir() : Vector3{
	return targetDir;
}

function setTargetDir(dir : Vector3){
	targetDir = dir;
}

function getError() : float{
	return targetPID.oldErr;
}