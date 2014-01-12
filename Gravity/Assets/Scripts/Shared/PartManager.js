#pragma strict
//is attached by script to ship

var componentPrefabs:Transform[];
var componentSpawns:Transform[];

public class PartManager extends MonoBehaviour
{

	private var ship : Ship;
	private var data : Field;
	
	public static function newPartManager(ship : Ship, data : Field) : PartManager{
		
		var thisObj : PartManager = ship.getGameObject().AddComponent(PartManager);
		thisObj.ship = ship;
		thisObj.data = data;
		return thisObj;
	}
	
	//dirty file parsing
	function parseParts() {
	
		for (var field : Field in data.getFields("Ship")){
			var type : int = parseInt(field.getField("type").getValue());
			var slot : int = parseInt(field.getField("slot").getValue());
			//if (type < 1) continue;//if there's no part at the current slot jump to next slot
			//else instantiate the part
			var object:GameObject = Network.Instantiate(componentPrefabs[type].gameObject,
				componentSpawns[slot].position,
				Quaternion.Euler(componentPrefabs[type].transform.rotation.eulerAngles + componentSpawns[slot].rotation.eulerAngles),
				NetworkGroup.COMPONENT);
			
			object.transform.parent = ship.getTransform();
			object.SendMessage("SetOwner",ship.getOwner());
			networkView.RPC("SetPartParent",RPCMode.OthersBuffered,object.networkView.viewID);
		}
	}
	
}