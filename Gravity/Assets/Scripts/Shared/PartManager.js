#pragma strict
//is attached by constructor to ship


public class PartManager extends MonoBehaviour
{

	static var componentPrefabs:Transform[];
	
	private var parentgo : GameObject;
	private var data : Field;
	
	private var parts : GameObject[];
	private var partdata : Field[];
	private var componentSpawns:Transform[];
	
	public static function newPartManager(parentgo : GameObject, data : Field) : PartManager{
		
		var thisObj : PartManager = parentgo.AddComponent(PartManager);
		thisObj.parentgo = parentgo;
		thisObj.data = data;
		var childSpawns : List.<Transform> = new List.<Transform>();
		for (var child : Transform in (thisObj.transform))
		{
			if (child.tag=="ComponentSpawn"){
				//Debug.Log(child);
				childSpawns.Add(child);
			}
		}
		thisObj.componentSpawns = childSpawns.ToArray();
		thisObj.parts = new GameObject[thisObj.componentSpawns.length];
		thisObj.partdata = new Field[thisObj.componentSpawns.length];
		
		thisObj.parseParts();
		return thisObj;
	}
	
	function addPart(type : int, slot : int) : GameObject{
		
		Debug.Log("Adding part of type "  + type + " at " + slot);
		for (var field : Field in data.getFields("part")){
			if (field.getField("slot").getInt() == slot){//slot > 0 &&  <- removed
				Debug.LogWarning("Tried to add part at non-empty slot");
				return;
			}
		}
		var field:Field = data.addField("part");
		field.addField("type").setInt(type);
		field.addField("slot").setInt(slot);
		return loadPart(field);
	}
	
	function loadPart(field : Field) : GameObject{
		var type : int = field.getField("type").getInt();
		var slot : int = field.getField("slot").getInt();
		//Debug.Log(componentPrefabs.Length + "|" + componentSpawns.Length);
		//Debug.Log("Spawning part of type " + type + " / " + componentPrefabs.Length + " at slot " + slot + " / " + componentSpawns.Length);
		//Debug.Log(componentPrefabs[type].transform.eulerAngles.x+" " +componentPrefabs[type].transform.eulerAngles.y + " " + componentPrefabs[type].transform.rotation.eulerAngles.z);
		var object:GameObject = Network.Instantiate(componentPrefabs[type].gameObject,
			componentSpawns[slot].position,
			transform.rotation * Quaternion.Euler(componentPrefabs[type].transform.rotation.eulerAngles + componentSpawns[slot].GetComponent(SpawnRotation).rot),
			NetworkGroup.COMPONENT);
		
		object.transform.parent = parentgo.transform;
		networkView.RPC("SetPartParent",RPCMode.OthersBuffered,object.networkView.viewID);
		object.SendMessage("LoadPart",field.atField("data"),SendMessageOptions.DontRequireReceiver);
		AccountManager_S.RequestConnectedUsers(object);
		//Debug.Log(object);
		parts[slot] = object;
		partdata[slot] = field;
		return object;
	}
	
	
	function getPart(slotId : int) : GameObject{
	
		return parts[slotId];
	}
	function removePart(slotId : int){
		Debug.Log("Removing part at " + slotId);
		unloadPart(parts[slotId]);
		if (!data.removeField(partdata[slotId])) Debug.LogWarning("Field associated with part doesn't exist.");
	}
	function removePart(nvid : NetworkViewID){
		for (var i : int = 0; i < parts.length; i++){
			if (parts[i].networkView.viewID == nvid) removePart(i);
		}
	}
	
	function unloadPart(go : GameObject){
		go.SendMessage("Unload",SendMessageOptions.DontRequireReceiver);
		if (go!=null)Network.Destroy(go.networkView.viewID);
	}
	
	function parseParts() {
	
		var corruptedFields : List.<Field> = new List.<Field>();
		for (var field : Field in data.getFields("part")){
			try{
				loadPart(field);
			}catch(ex){
				Debug.Log("corrupted Part - removing");
				corruptedFields.Add(field);
			}
		}
		for (var field : Field in corruptedFields){
			data.removeField(field);
		}
	}
	
	function Unload(){
		for (var part : GameObject in parts){
			unloadPart(part);
		}
	}
	
	function getBuildingSlotPositions() : Vector3[]{
		var pos : Vector3[] = new Vector3[componentSpawns.length];
		for (var i : int = 0; i < pos.length; i++){
			pos[i] = componentSpawns[i].localPosition;
		}
		
		return pos;
	}
	function getBuildingSlotChildrenIDs() : NetworkViewID[]{
		var ids : NetworkViewID[] = new NetworkViewID[componentSpawns.length];
		for (var i : int = 0; i < ids.length; i++){
			if (parts[i]){
				ids[i] = parts[i].networkView.viewID;
			}else{
				ids[i] = NetworkViewID.unassigned;
			}
		}
		
		return ids;
	}
	
}