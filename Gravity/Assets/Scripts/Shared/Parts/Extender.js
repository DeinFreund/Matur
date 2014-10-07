#pragma strict

class Extender extends  Part
{
	
	private var partManager: PartManager;
	private var data : Field;
	//private var partname : String;
	
	
	function LoadPart(field : Field){
		partManager = PartManager.newPartManager(gameObject, field.atField("parts"));
		data = field;
		super(field);
	}
	
	function getType() : int{
		return 0;
	}
	
	
	function getName() : String 
	{
		return partname;
	}
	
	function Unload(){
		super();
		partManager.Unload();
		data.getField("Name").setString(partname);
	}
	 

}