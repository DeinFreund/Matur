#pragma strict

class PartServer extends MonoBehaviour
{

	//////////
	//SERVER//
	//////////
	
	private var partname : String = "";
	private var client : NetworkPlayer;
	private var clientOnline = false;
	
	
	function OnUserConnected(user : MinimalUser){
		if (!Ship.getShip(transform)) return;
		
		if (Ship.getShip(transform).getOwner().getUsername().ToUpper() != user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setPartOwner",user.client,true);
		clientOnline = true;
	}
	function OnPlayerDisconnected(player : NetworkPlayer){
		if (client != player) return;
		clientOnline = false;
	}
	
	
	@RPC
	function RequestName(){
		networkView.RPC("setNameByServer",RPCMode.Others,partname);
	}
			
	@RPC
	function setServerName(name : String){
		Debug.Log("clients name:"  + name);
		gameObject.SendMessage("setName",name);
		
	}
	
	@RPC
	public function removeBuildingSlotChildS(i : int){
		
		var pm : PartManager = gameObject.GetComponent(PartManager);
		if (pm){
			pm.removePart(i);
		}
		RequestBuildingSlots();
	}
	@RPC
	public function addBuildingSlotChildS(type:int,slot : int, name : String){
		var pm : PartManager = gameObject.GetComponent(PartManager);
		var part : GameObject;
		if (pm){
			part = pm.addPart(type,slot);
			part.GetComponent(PartServer).setServerName(name);
		}
		RequestBuildingSlots();
	}
	
	
	@RPC
	function RequestBuildingSlots(){
		
		
		var pos : Vector3[];
		var ids : NetworkViewID[];
		if (gameObject.GetComponent(PartManager)){
			pos = gameObject.GetComponent(PartManager).getBuildingSlotPositions();
			ids = gameObject.GetComponent(PartManager).getBuildingSlotChildrenIDs();
		}
		if (pos == null || pos.length == 0) return; //no need to send empty arrays, also this doesnt work with unity's RPCs
		Debug.Log("sending building slots " + pos);
		networkView.RPC("setBuildingSlots",RPCMode.Others, pos, ids);
	}
}