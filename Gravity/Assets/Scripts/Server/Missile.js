#pragma strict

var target : Transform;
var thrust : float = 100;
var mode : int = 0;
var minSpeed : float = 10;
var damage : float = 10;
var explosion : Transform;
var sas : SAS;
var maxETA : float = 6;
var accelerating : boolean = true;
var selfdTime : float = 90;
var marker : GameObject;
var marker2 : GameObject;

private var dirPID : PID = new PID(1f,0,0);
private var startTime : float = 0;
private var speedPID : PID = new PID(0.2f,0,0);
private var lastVel : Vector3 = Vector3.zero;

static function newMissile(prefab : int, pos : Vector3, rot : Quaternion, velocity : Vector3 ,target : Transform) : Missile{
	Debug.Log("spawning new missile");
	var go = Network.Instantiate(Prefabs.getMissilePrefabs()[prefab],pos,rot,NetworkGroup.PROJECTILE);
	var missile = go.gameObject.AddComponent(Missile) as Missile;
	missile.target = target;
	missile.rigidbody.velocity = velocity;
	missile.explosion = Prefabs.getMissileExplosions()[prefab];
	return missile;
	
}

function Start () {
	if (Network.isClient) enabled = false;
	//Time.timeScale = 0.2;
	startTime = Time.time;
	sas = GetComponent(SAS);
	if (target!=null){
		sas.enable(true);
		sas.setActive(true);
	}
	if (!(Network.isClient || Network.isServer)){
		target = GameObject.Find("Cube").transform;
	}
	if (target!=null)lastVel = target.rigidbody.velocity;
	marker = GameObject.Find("Marker");
	marker2 = GameObject.Find("Marker2");
}

function Update () {

	if (target!=null){
		var toTarget : Vector3 = (target.position - transform.position).normalized;
		var toMe : Vector3 = (transform.position-target.position).normalized;
		var vel : Vector3 = rigidbody.velocity.normalized;
		
		
		var velToTargetFromMe : float = Vector3.Dot(rigidbody.velocity,toTarget);
		var velToMeFromTarget : float = Vector3.Dot(target.rigidbody.velocity,toMe);
		var velToTarget : float = velToTargetFromMe + velToMeFromTarget;
		var eta = Vector3.Distance(transform.position,target.position)/velToTarget;
		if (eta < 0) {
			eta = 1000f;
		}
		var	targetPos : Vector3 = target.position;
		if (mode == 0) targetPos = target.position + target.rigidbody.velocity * Mathf.Min(10f,eta);
		if (marker) marker.transform.position = targetPos;
		toTarget = (targetPos - transform.position).normalized;
		toMe  = (transform.position-targetPos).normalized;
		var accelaxis = toTarget;//( rigidbody.velocity-target.rigidbody.velocity).normalized;
		var mir = (Vector3.Dot(toTarget,rigidbody.velocity)*toTarget*2-rigidbody.velocity);//mirrored velocity at direction
		var correctAmt : float = Vector3.Exclude(toTarget,mir).magnitude;
		var maxAccel : float = 1e20;
		var correct : Vector3 = Vector3.Exclude(toTarget,mir).normalized;//flattened mirrored velocity
		if (marker2) marker2.transform.position = transform.position + (rigidbody.velocity + Vector3.Exclude(toTarget,mir)) * Mathf.Min(10f,eta);
		lastVel  = target.rigidbody.velocity;
		//if (Vector3.Dot(toTarget,dir) < 0 || eta<minETA ) dir = -vel;
		
		switch(mode){
		case 0:
		case 1:
			var pidfac =  0.65f;//*Mathf.Min(1f,0.5*Mathf.Min(Mathf.Abs(minSpeed - velToTarget),Mathf.Abs(eta - maxETA)));
			var fac : float = (1-pidfac)*Mathf.Clamp(-Mathf.Pow(1.1f,dirPID.getCorrection(Vector3.Angle(toTarget,vel),Time.deltaTime)),-1f,1f);
			var accel : float = -1;
			if (velToTarget < minSpeed) accel = 1;
			if (eta > maxETA) accel = 1;
			//if (velToTarget < 0) accel *= -1;
			
			fac += pidfac*(accel);
			fac = accel * (1-Mathf.Max(0,correctAmt  /( Time.deltaTime * thrust / rigidbody.mass)));
			if (eta < maxETA) fac = 0;
			//Debug.Log(eta + "|" + velToTarget + " -> " + accel + " -> " + fac);
			var dir = fac*accelaxis + (1-Mathf.Abs(fac))*correct;
			if (Mathf.Abs(fac) < 1){
				maxAccel  = correctAmt * 1f / (1-Mathf.Abs(fac));
				//Debug.Log( correctAmt + " / "  + (1-Mathf.Abs(fac)));
				//Debug.Log(maxAccel);
			}
			//Debug.Log(fac);
			sas.setTargetDir(dir);
			/*Debug.DrawRay(transform.position,( rigidbody.velocity-target.rigidbody.velocity).normalized *5,Color.yellow,Time.deltaTime);
			Debug.DrawRay(transform.position,(1-Mathf.Abs(fac))*correct*5,Color.blue,Time.deltaTime);
			Debug.DrawRay(transform.position,dir*5,Color.green,Time.deltaTime);
			*/
			Debug.DrawRay(transform.position,rigidbody.velocity*5,Color.blue,Time.deltaTime);
			Debug.DrawRay(transform.position,mir*5,Color.yellow,Time.deltaTime);
			Debug.DrawRay(transform.position+rigidbody.velocity*5,correct * correctAmt*5,Color.green,Time.deltaTime);
			break;
		case 2:
			if (vel == Vector3.zero){
				sas.setTargetDir(toTarget);
			}else
			if (Vector3.Angle(toTarget,vel) > 90){
				sas.setTargetDir(-vel);
			}else{
				sas.setTargetDir(mir);
			}
			break;
		case 3:
			sas.setTargetDir(toTarget);
			break;
		}
	}
	var adir  = transform.forward;
	if (sas.getError() < 40){
		adir = sas.getTargetDir();
	}
	if (sas.getError() > 40 && accelerating){
		turnOffEngine();
	}else if (sas.getError() <= 40 && !accelerating){
		turnOnEngine();
	}
	if (accelerating && sas.getError() < 40)
		//transform.rigidbody.AddForce(Mathf.Min(Time.deltaTime * thrust,maxAccel * rigidbody.mass) * adir ); 
		transform.rigidbody.AddForce(Time.deltaTime * thrust * adir.normalized ); 
	Debug.Log(Time.time + ": " + rigidbody.velocity.magnitude);
	if (Time.time - startTime > selfdTime){
		OnCollisionEnter(null);
	}
}

private function turnOnEngine(){
	accelerating = true;
	for (var component : ParticleEmitter in gameObject.GetComponentsInChildren(ParticleEmitter)){
		component.minEmission*=1000;
		component.maxEmission*=1000;
	}
}
private function turnOffEngine(){
	accelerating = false;
	for (var component : ParticleEmitter in gameObject.GetComponentsInChildren(ParticleEmitter)){
		component.minEmission*=0.001;
		component.maxEmission*=0.001;
	}
}

function OnCollisionEnter(collision : Collision) {
	if (!enabled || Network.isClient) return;
	if (collision) collision.collider.attachedRigidbody.SendMessage("damage",damage,SendMessageOptions.DontRequireReceiver);
	var exp : Transform;
	if (Network.isClient || Network.isServer)
	{
		exp = Network.Instantiate(explosion,transform.position,transform.rotation,0);exp.networkView.RPC("setParent",RPCMode.All,collision.collider.transform.networkView.viewID);
		if (!enabled) return;
		Network.RemoveRPCs(networkView.viewID);
		
		if (!enabled) return;
		Network.Destroy(networkView.viewID);
		enabled = false;
	}
	else
	{
		//for debugging only
		exp = Instantiate(explosion,transform.position,transform.rotation);
		Debug.Break();
	}
	
}