#pragma strict

var speed : Vector3 = new Vector3(0f,-5f,0f);

function Start () {
	rigidbody.velocity = speed;
}
