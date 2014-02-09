#pragma strict

var updatesPerSecond:int = 2;
var maxSpeed:float = 10;
var maxIntensity:float = 5;
var maxFlare:float = 5;
var accel :float = 1.0;

private var lastUpdate:float=0;
function Start () {

}

function Update () {

	if (Time.time - 1f/updatesPerSecond > lastUpdate){
		lastUpdate = Time.time;
		this.particleSystem.startSpeed = maxSpeed * accel;
		var light:Light = GetComponentInChildren(Light);
		light.intensity = accel*maxIntensity;
		var bright:FlareBrightness = GetComponentInChildren(FlareBrightness);
		bright.strength = accel*maxFlare;
	}
}