#pragma strict

import System.ComponentModel;
import LuaInterface;

static var shipPrefabs : Transform[];

public class Ship extends MonoBehaviour{
	
	static private var ships : List.<Ship>;
	
	private var owner : Player;
	private var partManager : PartManager;
	private var data : Field;
	private var main : boolean;
	private var lastRPC : float;
	private var lastAI : float;
	private var rpcFreq : float = 5;
	private var luaFreq : float = 5;
	private var shipAI : ShipAI;
	private var shipId : int;
	private var luaPath : String;
	private var parts : Dictionary.<String,List.<Part> > = new Dictionary.<String,List.<Part> >();
	
	public static function newShip(owner : Player, data : Field) : Ship{
		
		var pos : Vector3 = new Vector3(0,0,0);
		var rot : Quaternion = Quaternion.Euler(0,0,90);
		return newShip(owner,data,pos,rot);
	}
	
	public static function newShip(owner : Player, data : Field, pos : Vector3, rot : Quaternion) : Ship{
		
		return newShip(owner, data, pos, rot, "");
	}
	public static function newShip(owner : Player, data : Field, pos : Vector3, rot : Quaternion, luaPresetPath : String) : Ship{
		
		var prefab : Transform;
		prefab = shipPrefabs[parseInt(data.getField("shipPrefab").getValue())];
		var targetObject : GameObject = Network.Instantiate(prefab,pos,rot,NetworkGroup.PLAYER).gameObject;
		var thisObj : Ship = targetObject.AddComponent(Ship);
		thisObj.owner = owner;
		thisObj.data = data;
		thisObj.partManager = PartManager.newPartManager(targetObject,data.getField("parts"));
		thisObj.main = data.atField("main").getBoolean();
		thisObj.gameObject.AddComponent(RadarBlob);
		thisObj.gameObject.GetComponent(RadarBlob).setBlobEmission(100f);
		
		Debug.Log("shipid: " + data.getField("shipId"));
		if (!data.getField("shipId")){//if there ship doesn't have a unique Ship Id yet
			data.addField("shipId").setInt(GlobalVars.getUniqueShipId());
		}
		if (!FileIO.Exists(luaPresetPath)){
			luaPresetPath = GlobalVars.getLuaShipPresetPath();
		}
		
		thisObj.shipId = data.getField("shipId").getInt();
		thisObj.luaPath = "shipscripts/" + thisObj.shipId + ".lua";
		if (!FileIO.Exists(thisObj.luaPath)){
			//if object doesn't have a script yet, create one
			Debug.Log("Creating " + thisObj.luaPath + " for ship " + data.getField("shipId").getInt());
			FileIO.Copy(luaPresetPath,thisObj.luaPath);	
		}
		thisObj.shipAI = new ShipAI(thisObj.luaPath,thisObj);
		
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
	
	public function getShipAI() : ShipAI{
		
		return shipAI;
	}
	
	function Update(){
		if (Network.isServer) Update_S();
		
	}
	
	function Update_S(){
		if (Time.time - lastRPC > 1f / rpcFreq) UpdateRemote();
		if (Time.time - lastAI > 1f / luaFreq) {
			lastAI = Time.time;
			shipAI.Update();
		}
		
	}
	
	function UpdateRemote(){
		lastRPC = Time.time;
		networkView.RPC("setVelocity", RPCMode.Others , rigidbody.velocity, rigidbody.angularVelocity);
	}
	
	
	function Unload(){
		partManager.Unload();
		Network.Destroy(gameObject);
		
	}
	
	public function registerPart(part : Part, name :String){
		if (name == "") return;
		if (!parts.ContainsKey(name)){
			parts.Add(name,new List.<Part>());
		}
		//Debug.Log("registered " + name);
		parts[name].Add(part);
	}
	public function unregisterPart(part : Part, name :String){
		if (name == "") return;
		if (!parts.ContainsKey(name)) return;
		parts[name].Remove(part);
	}
	
	public function getParts(name : String) : List.<Part>{
		return parts.ContainsKey(name) ? parts[name] : new List.<Part>();
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
	/*
	//replaced by RadarBlob.getEmission
	function getEmission() : float{
		return emission;
	}
	*/
	function getData() : Field{
		return data.getClone();
	}
	
	function OnGUI(){
		if (GUI.Button(new Rect(300,100,150,50),"Save da ship")){
			Blueprints.addBlueprint(this);
		}
		if (shipId == 1){
		shipAI.xx = GUI.VerticalSlider(Rect(20,20,20,100),shipAI.xx,-1f,1f);
		shipAI.yy = GUI.VerticalSlider(Rect(50,20,20,100),shipAI.yy,-1f,1f);
		shipAI.zz = GUI.VerticalSlider(Rect(80,20,20,100),shipAI.zz,-1f,1f);
		shipAI.am = GUI.VerticalSlider(Rect(110,20,20,100),shipAI.am,-1f,1f);
		}
	}
	
	function OnOwnerConnected(){
		Debug.Log("Enabling Controls");
		networkView.RPC("Enable",owner.getNetworkPlayer());
	}
	
	
	
}