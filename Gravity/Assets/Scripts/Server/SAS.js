#pragma strict

var working : boolean = true;

var targetRot : Quaternion = new Quaternion();

function Start () {
	if (!Network.isServer) enabled = false;
}

function Update () {
	if (working){
		transform.rotation = targetRot;
	}
}

function enable(enable : boolean){
	working = enable;
}

function setTargetRot(rot : Quaternion){
	targetRot = rot;
}