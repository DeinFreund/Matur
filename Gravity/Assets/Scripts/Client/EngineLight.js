#pragma strict

var updatesPerSecond:int = 2;
var maxSpeed:float = 10;
var maxIntensity:float = 5;
var maxFlare:float = 5;

private var lastUpdate:float=0;
function Start () {

}

function Update () {

	if (Time.time + 1f/updatesPerSecond > lastUpdate){
		lastUpdate = Time.time;
		var light:Light = GetComponentInChildren(Light);
		light.intensity = this.particleSystem.startSpeed/maxSpeed*maxIntensity;
		var bright:FlareBrightness = GetComponentInChildren(FlareBrightness);
		bright.strength = this.particleSystem.startSpeed/maxSpeed*maxFlare;
	}
}