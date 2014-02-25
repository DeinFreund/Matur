#pragma strict

public class ShipClient extends MonoBehaviour
{
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) enabled = false;
	}
	
	function Update_C(){
		
	}
	
	@RPC
	function Enable(){
		Debug.Log("clientsided controls on ship enabled");
		Camera.main.GetComponent(MouseOrbit).target = transform;
	}
	
	
	@RPC
	function SetPartParent(childId : NetworkViewID){
		Debug.Log("set parent");
		for (var go : GameObject in FindObjectsOfType(GameObject)){
			if (go.networkView != null && go.networkView.viewID == childId){
				go.transform.parent = transform;
			}
		}
	}
}
