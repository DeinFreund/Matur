#pragma strict

var components:GameObject[];
var componentSpawns:Transform[];

function Start () {

}

function Update () {

}

function LoadComponents(data:String[],offset:int, pmanager: PlayerManager_S) : int{
	var numberOfComponents:int = parseInt(data[offset]);
	offset ++;
	for (var component:int = 0; component < numberOfComponents; component ++){
		var type:int = parseInt(data[offset]);
		offset ++;
		if (type < 1) continue;
		var object:GameObject = Network.Instantiate(components[type],
			componentSpawns[component].position,
			Quaternion.Euler(components[type].transform.rotation.eulerAngles + componentSpawns[component].rotation.eulerAngles),
			NetworkGroup.COMPONENT);
		
		//object.GetComponent(ConfigurableJoint).connectedBody = gameObject.rigidbody; // replaced by parenting
		object.transform.parent = transform;
		object.SendMessage("SetOwner",pmanager);
		networkView.RPC("SetComponentParent",RPCMode.OthersBuffered,object.networkView.viewID);
	}
	return offset;
}

