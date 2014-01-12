#pragma strict
//"handles" a gameObject thus should be seen as owner instead of the gameobject itself

static var shipPrefabs : Transform[];

public class Ship extends MonoBehaviour{
	
	private var owner : Player;
	private var partManager : PartManager;
	private var data : Field;
	
	public static function newShip(owner : Player, data : Field) : Ship{
		
		var pos : Vector3 = new Vector3(0,0,0);
		var rot : Quaternion = new Quaternion(0,0,0,0);
		var prefab : Transform;
		prefab = shipPrefabs[parseInt(data.getField("shipPrefab").getValue())];
		var targetObject : GameObject = Network.Instantiate(prefab,pos,rot,NetworkGroup.PLAYER).gameObject;
		var thisObj : Ship = targetObject.AddComponent(Ship);
		thisObj.owner = owner;
		thisObj.data = data;
		thisObj.partManager = new PartManager.newPartManager(thisObj,data.getField("parts"));
		return thisObj;
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
}