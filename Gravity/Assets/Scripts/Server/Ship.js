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
	private var lastAI : float;
	private var luaFreq : float = 5;
	private var shipAI : ShipAI;
	private var shipId : int;
	private var luaPath : String;
	private var health : float = 1;
	private var maxHealth : float = 1;
	private var partNames : Dictionary.<String,List.<Part> > = new Dictionary.<String,List.<Part> >();
	private var partTypes : Dictionary.<int,List.<Part> > = new Dictionary.<int,List.<Part> >();
	
	
	
	public static function newShip(owner : Player, data : Field) : Ship{
		
		return newShip(owner, data, "");
	}
	public static function newShip(owner : Player, data : Field,  luaPresetPath : String) : Ship{
		
		
		var prefab : Transform;
		prefab = shipPrefabs[parseInt(data.getField("shipPrefab").getValue())];
		var targetObject : GameObject = Network.Instantiate(prefab,Vector3.zero,Quaternion.identity,NetworkGroup.PLAYER).gameObject;
		var thisObj : Ship = targetObject.AddComponent(Ship);
		thisObj.owner = owner;
		thisObj.data = data;
		thisObj.partManager = PartManager.newPartManager(targetObject,data.getField("parts"));
		thisObj.main = data.atField("main").getBoolean();
		thisObj.health = data.atField("health").getFloat();
		thisObj.maxHealth = data.atField("maxhealth").getFloat();
		thisObj.gameObject.AddComponent(RadarBlob);
		thisObj.gameObject.GetComponent(RadarBlob).setBlobEmission(100f);
		if (data.getField("pos")==null){
			//spawn
			thisObj.spawn();
		}else{
			thisObj.transform.position = data.getField("pos").getVector3();
			thisObj.transform.rotation = data.getField("rot").getQuaternion();
			thisObj.rigidbody.velocity = data.getField("vel").getVector3();
		}
		
		//Debug.Log("shipid: " + data.getField("shipId"));
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
		if (Time.time - lastAI > 1f / luaFreq) {
			lastAI = Time.time;
			shipAI.Update();
		}
		
	}
	
	
	
	function Unload(){
		partManager.Unload();
		data.atField("health").setFloat(health);
		data.atField("pos").setVector3(transform.position);
		data.atField("rot").setQuaternion(transform.rotation);
		data.atField("vel").setVector3(rigidbody.velocity);
		Network.Destroy(gameObject);
		
	}
	
	public function getShipId() : int{
		return shipId;
	}
	
	public function registerPart(part : Part, name :String){
		if (name != ""){
			if (!partNames.ContainsKey(name)){
				partNames.Add(name,new List.<Part>());
			}
			//Debug.Log("registered " + name + " of type " + part.getType());
			partNames[name].Add(part);
		}
		
		if (!partTypes.ContainsKey(part.getType())){
			partTypes.Add(part.getType(),new List.<Part>());
		}
		partTypes[part.getType()].Add(part);
	}
	public function unregisterPart(part : Part, name :String){
		partTypes[part.getType()].Remove(part);
		if (name == "") return;
		if (!partNames.ContainsKey(name)) return;
		partNames[name].Remove(part);
	}
	
	
	public function getParts(name : String) : List.<Part>{
		return partNames.ContainsKey(name) ? partNames[name] : new List.<Part>();
	}
	public function getParts(type : int) : List.<Part>{
		return partTypes.ContainsKey(type) ? partTypes[type] : new List.<Part>();
	}
	
	function setMain(val : boolean){
		main = val;
		data.atField("main").setBoolean(val);
		Debug.Log("Set " + owner.getUsername() +"'s ship as main ship: " + data.getField("main").getBoolean());
	}
	function isMain(){
		return main;
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
		networkView.RPC("setHealth",owner.getNetworkPlayer(),health,maxHealth);
	}
	
	public function damage(amt : float){
		health -= amt;
		Debug.Log("Ship " + shipId + " has " + health + " hp left.");
		if (owner.isConnected()){
			networkView.RPC("setHealth",owner.getNetworkPlayer(),health,maxHealth);
		}
		if (health <= 0) die();
	}
	
	public function die(){
		Network.Instantiate(Prefabs.getShipExplosion(),transform.position,transform.rotation,0);
		health = maxHealth;
		spawn();
	}
	
	private function spawn(){
	
		var s = Spawn.getSpawn();
		transform.position = s.position;
		transform.rotation = s.rotation;
		rigidbody.velocity = WorldGen.getOrbitalVelocity(gameObject);
	}
	
	
}