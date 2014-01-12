#pragma strict

function Start () {

}

function Update () {
	
	
}

function OnConnectedToServer(){
	Debug.Log("Sucessfully connected");
	for (var go : GameObject in FindObjectsOfType(GameObject))
		go.SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver); 
}


function OnNetworkLoadedLevel() {

	if (Network.isServer) this.enabled = false;
}
