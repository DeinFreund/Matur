#pragma strict

var time : float = 5.0;

private var start : float;

function Start () {
	start = Time.time;
}

function Update () {
	if (Time.time - start > time) {
		Network.RemoveRPCs(networkView.viewID);
		Network.Destroy(networkView.viewID);
	}
}