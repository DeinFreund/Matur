#pragma strict

function Start () {

}

function Update () {

}

@RPC
function SetComponentParent(objId : NetworkViewID){
	
	if (Network.isServer) return;
	NetworkView.Find(objId).transform.parent = transform;
	Debug.Log("Parent set by server");
}