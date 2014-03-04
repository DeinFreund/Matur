#pragma strict
//is attached by constructor to ship

static var componentPrefabs:Transform[];
var componentSpawns:Transform[];

public class PartManager extends MonoBehaviour
{

	private var parentgo : GameObject;
	private var data : Field;
	
	private var parts : List.<GameObject>;
	
	public static function newPartManager(parentgo : GameObject, data : Field) : PartManager{
		
		var thisObj : PartManager = parentgo.AddComponent(PartManager);
		thisObj.parentgo = parentgo;
		thisObj.data = data;
		thisObj.parts = new List.<GameObject>();
		var childSpawns : List.<Transform> = new List.<Transform>();
		for (var child : Transform in thisObj.transform)
		{
			if (child.tag=="ComponentSpawn"){
				//Debug.Log(child);
				childSpawns.Add(child);
			}
		}
		thisObj.componentSpawns = childSpawns.ToArray();
		
		thisObj.parseParts();
		return thisObj;
	}
	
	function addPart(part : Part, slot : int){
		
		for (var field : Field in data.getFields("part")){
			if (slot > 0 && field.getField("slot").getInt() == slot){
				Debug.LogWarning("Tried to add part at non-empty slot");
				return;
			}
		}
		var field:Field = data.addField("part");
		field.addField("type").setInt(part.getType());
		field.addField("slot").setInt(slot);
		loadPart(field);
	}
	
	function loadPart(field : Field){
		var type : int = field.getField("type").getInt();
		var slot : int = field.getField("slot").getInt();
		//Debug.Log(componentPrefabs.Length + "|" + componentSpawns.Length);
		Debug.Log("Spawning part of type " + type + " / " + componentPrefabs.Length + " at slot " + slot + " / " + componentSpawns.Length);
		Debug.Log(componentPrefabs[type].transform.eulerAngles.x+" " +componentPrefabs[type].transform.eulerAngles.y + " " + componentPrefabs[type].transform.rotation.eulerAngles.z);
		var object:GameObject = Network.Instantiate(componentPrefabs[type].gameObject,
			componentSpawns[slot].position,
			Quaternion.Euler(componentPrefabs[type].transform.rotation.eulerAngles + componentSpawns[slot].GetComponent(SpawnRotation).rot),
			NetworkGroup.COMPONENT);
		
		object.transform.parent = parentgo.transform;
		networkView.RPC("SetPartParent",RPCMode.OthersBuffered,object.networkView.viewID);
		object.SendMessage("LoadPart",field.getField("data"),SendMessageOptions.DontRequireReceiver);
		//Debug.Log(object);
		parts.Add(object);
	}
	
	function unloadPart(go : GameObject){
		go.SendMessage("Unload",SendMessageOptions.DontRequireReceiver);
		
			
	}
	
	function parseParts() {
	
		for (var field : Field in data.getFields("part")){
			loadPart(field);
		}
	}
	
	function Unload(){
		for (var part : GameObject in parts){
			unloadPart(part);
		}
	}
	
	
}