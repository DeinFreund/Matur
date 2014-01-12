#pragma strict

private var pos : Vector3;
private var rot : Quaternion;


function Start () {
	pos = transform.position;
	rot = transform.rotation;
}

function Update () {
	transform.position = pos;
	transform.rotation = rot;	
}