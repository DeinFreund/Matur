#pragma strict

var target : Transform;
var thrust : float = 100;
var minSpeed : float = 10;
var damage : float = 10;
var explosion : Transform;
var sas : SAS;
var maxETA : float = 6;
var accelerating : boolean = true;
var selfdTime : float = 90;

private var dirPID : PID = new PID(1f,0,0);
private var startTime : float = 0;
private var speedPID : PID = new PID(0.2f,0,0);

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
	startTime = Time.time;
	sas = GetComponent(SAS);
	if (target!=null){
		sas.enable(true);
		sas.setActive(true);
	}
}

function Update () {

	if (target!=null){
		var toTarget : Vector3 = (target.position - transform.position).normalized;
		var toMe : Vector3 = (transform.position-target.position).normalized;
		var vel : Vector3 = rigidbody.velocity.normalized;
		
		var dir = Vector3.Dot(toTarget,vel)*toTarget*2-vel;//mirrored velocity at direction
		var velToTargetFromMe : float = Vector3.Dot(rigidbody.velocity,toTarget);
		var velToMeFromTarget : float = Vector3.Dot(target.rigidbody.velocity,toMe);
		var velToTarget : float = velToTargetFromMe + velToMeFromTarget;
		var eta = Vector3.Distance(transform.position,target.position)/velToTarget;
		if (eta < 0) eta = 1000f;
		var correct : Vector3 = Vector3.Exclude(toTarget,dir).normalized;//flattened mirrored velocity
		//Debug.DrawRay(transform.position,vel*5,Color.yellow,Time.deltaTime);
		//Debug.DrawRay(transform.position,toTarget*5,Color.green,Time.deltaTime);
		//Debug.DrawRay(transform.position,dir*5,Color.blue,Time.deltaTime);
		//if (Vector3.Dot(toTarget,dir) < 0 || eta<minETA ) dir = -vel;
		var pidfac =  0.7f;//*Mathf.Min(1f,0.5*Mathf.Min(Mathf.Abs(minSpeed - velToTarget),Mathf.Abs(eta - maxETA)));
		var fac : float = (1-pidfac)*Mathf.Clamp(-Mathf.Pow(1.1f,dirPID.getCorrection(Vector3.Angle(toTarget,vel),Time.deltaTime)),-1f,1f);
		var accel : float = -1;
		if (velToTarget < minSpeed) accel = 1;
		if (eta > maxETA) accel = 1;
		
		fac += pidfac*(accel);
		//Debug.Log(eta + "|" + velToTarget + " -> " + accel + " -> " + fac);
		dir = fac*toTarget + (1-Mathf.Abs(fac))*correct;
		if (sas.getError() > 40 && accelerating){
			turnOffEngine();
		}else if (sas.getError() <= 40 && !accelerating){
			turnOnEngine();
		}
		sas.setTargetDir(dir);
	}
	var adir  = transform.forward;
	if (sas.getError() < 40){
		adir = sas.getTargetDir();
	}
	if (accelerating)
		transform.rigidbody.AddForce(adir * Time.deltaTime * thrust); 
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
	if (!enabled) return;
	if (collision) collision.collider.attachedRigidbody.SendMessage("damage",damage,SendMessageOptions.DontRequireReceiver);
	Network.Instantiate(explosion,transform.position,transform.rotation,0);
	
	if (!enabled) return;
	Network.RemoveRPCs(networkView.viewID);
	
	if (!enabled) return;
	Network.Destroy(networkView.viewID);
}