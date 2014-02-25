#pragma strict

class Extender extends MonoBehaviour implements Part
{
	
	private var partManager: PartManager;
	private var data : Field;
	
	
	function LoadPart(field : Field){
		partManager = PartManager.newPartManager(gameObject, field.getField("parts"));
	
	}
	
	function getType() : int{
		return 3;
	}
	
	

}