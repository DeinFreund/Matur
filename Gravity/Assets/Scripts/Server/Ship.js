#pragma strict


static var shipPrefabs : Transform[];

public class Ship extends MonoBehaviour{
	
	private var owner : Player;
	private var partManager : PartManager;
	private var data : Field;
	private var main : boolean;
	
	public static function newShip(owner : Player, data : Field) : Ship{
		
		var pos : Vector3 = new Vector3(0,0,0);
		var rot : Quaternion = new Quaternion(0,0,0,0);
		
		var prefab : Transform;
		prefab = shipPrefabs[parseInt(data.getField("shipPrefab").getValue())];
		var targetObject : GameObject = Network.Instantiate(prefab,pos,rot,NetworkGroup.PLAYER).gameObject;
		var thisObj : Ship = targetObject.AddComponent(Ship);
		thisObj.owner = owner;
		thisObj.data = data;
		thisObj.partManager = PartManager.newPartManager(targetObject,data.getField("parts"));
		thisObj.main = data.atField("main").getBoolean();
		return thisObj;
	}
	
	function Update(){
		if (Network.isServer) Update_S();
		
	}
	
	function Update_S(){
		
	}
	
	function Unload(){
		partManager.Unload();
		Network.Destroy(gameObject);
		
	}
	
	function setMain(val : boolean){
		main = val;
		data.atField("main").setBoolean(val);
		Debug.Log("Set " + owner.getUsername() +"'s ship as main ship: " + data.getField("main").getBoolean());
	}
	
	function getTransform() : Transform {
		return transform;
	}
	
	function getGameObject() : GameObject {
		return gameObject;
	}
	
	function getOwner() : Player {
		
		return owner;
	}
	
	function OnOwnerConnected(){
		Debug.Log("Enabling Controls");
		networkView.RPC("Enable",owner.getNetworkPlayer());
	}
	
}