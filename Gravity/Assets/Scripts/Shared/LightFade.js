#pragma strict

var mult : float = 0.1;
var delay : float = 0;
private var start : float;

function Start () {
	start = Time.time;
}

function Update () {
	if (Time.time - start > delay)
		light.intensity *= Mathf.Pow(mult,Time.deltaTime);
}