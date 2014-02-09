#pragma strict
//is attached by constructor to ship

static var componentPrefabs:Transform[];
var componentSpawns:Transform[];

public class PartManager extends MonoBehaviour
{

	private var ship : Ship;
	private var data : Field;
	
	public static function newPartManager(ship : Ship, data : Field) : PartManager{
		
		var thisObj : PartManager = ship.getGameObject().AddComponent(PartManager);
		thisObj.ship = ship;
		thisObj.data = data;
		var childSpawns : List.<Transform> = new List.<Transform>();
		for (var child : Transform in thisObj.transform)
		{
			if (child.tag=="ComponentSpawn"){
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
		Debug.Log(componentPrefabs.Length + "|" + componentSpawns.Length);
		var object:GameObject = Network.Instantiate(componentPrefabs[type].gameObject,
			componentSpawns[slot].position,
			Quaternion.Euler(componentPrefabs[type].transform.rotation.eulerAngles + componentSpawns[slot].rotation.eulerAngles),
			NetworkGroup.COMPONENT);
		
		object.transform.parent = ship.getTransform();
		networkView.RPC("SetPartParent",RPCMode.OthersBuffered,object.networkView.viewID);
	}
	
	function parseParts() {
	
		for (var field : Field in data.getFields("part")){
			loadPart(field);
		}
	}
	
	
}