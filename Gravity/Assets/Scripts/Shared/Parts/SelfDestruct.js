#pragma strict

var time : float = 5.0;


function Start () {
	Invoke("Destroy",time);
}

function Destroy () {
	Network.RemoveRPCs(networkView.viewID);
	Network.Destroy(networkView.viewID);
}

@RPC
function setParent(parent : NetworkViewID){
	try{
		transform.parent = networkView.Find(parent).transform;
	}catch(ex){
		//parent not found, doesn't matter
	}
}