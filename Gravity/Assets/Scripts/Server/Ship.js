#pragma strict


static var shipPrefabs : Transform[];

public class Ship extends MonoBehaviour{
	
	static private var ships : List.<Ship>;
	
	private var owner : Player;
	private var partManager : PartManager;
	private var data : Field;
	private var main : boolean;
	private var emission : float = 100.0;
	private var lastRPC : float;
	private var rpcFreq : float = 5;
	
	public static function newShip(owner : Player, data : Field) : Ship{
		
		var pos : Vector3 = new Vector3(0,0,0);
		var rot : Quaternion = new Quaternion(0,0,0,0);
		return newShip(owner,data,pos,rot);
	}
	
	public static function newShip(owner : Player, data : Field, pos : Vector3, rot : Quaternion) : Ship{
		
		var prefab : Transform;
		prefab = shipPrefabs[parseInt(data.getField("shipPrefab").getValue())];
		var targetObject : GameObject = Network.Instantiate(prefab,pos,rot,NetworkGroup.PLAYER).gameObject;
		var thisObj : Ship = targetObject.AddComponent(Ship);
		thisObj.owner = owner;
		thisObj.data = data;
		thisObj.partManager = PartManager.newPartManager(targetObject,data.getField("parts"));
		thisObj.main = data.atField("main").getBoolean();
		
		if (ships == null) ships = new List.<Ship>();
		ships.Add(thisObj);
		return thisObj;
	}
	
	public static function getShip(t : Transform) : Ship{
		
		while (t.parent != null) t=t.parent;
		return t.GetComponent(Ship);
	}
	
	public static function getShips() : List.<Ship>{
		return ships;
	}
	
	function Update(){
		if (Network.isServer) Update_S();
		
	}
	
	function Update_S(){
		if (Time.time - lastRPC > 1f / rpcFreq) UpdateRemote();
	}
	
	function UpdateRemote(){
		lastRPC = Time.time;
		networkView.RPC("setVelocity", RPCMode.Others , rigidbody.velocity, rigidbody.angularVelocity);
		networkView.RPC("setEmission", RPCMode.Others , emission);
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
	
	function getEmission() : float{
		return emission;
	}
	
	function getData() : Field{
		return data.getClone();
	}
	
	function OnGUI(){
		if (GUI.Button(new Rect(300,100,150,50),"Save da ship")){
			Blueprints.addBlueprint(this);
		}
	}
	
	function OnOwnerConnected(){
		Debug.Log("Enabling Controls");
		networkView.RPC("Enable",owner.getNetworkPlayer());
	}
	
}