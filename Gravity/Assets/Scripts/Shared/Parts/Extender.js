#pragma strict

class Extender extends  Part
{
	
	private var partManager: PartManager;
	private var data : Field;
	//private var partname : String;
	
	
	function LoadPart(field : Field){
		partManager = PartManager.newPartManager(gameObject, field.atField("parts"));
		gameObject.SendMessage("setName",field.atField("Name").getString());
		data = field;
	}
	
	function getType() : int{
		return 0;
	}
	
	
	function getName() : String 
	{
		return partname;
	}
	function setName(name : String){
		partname = name;
	}
	
	function Unload(){
		partManager.Unload();
		data.getField("Name").setString(partname);
	}
	 

}