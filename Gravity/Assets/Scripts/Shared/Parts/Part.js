#pragma strict

class Part extends MonoBehaviour implements IPart
{
	
	protected var partname : String = "";
	protected var maxhp : float = 100;
	protected var hp : float = maxhp;
	
	function damage(amt : float){
		hp -= amt;
		if (hp < 0){
			die();
			Unload();
			transform.parent.GetComponent(PartManager).removePart(networkView.viewID);
		}
	}
	
	function die(){
		Debug.Log(partname + " was destroyed");
	}
	
	function getType() :int 
	{
		return -1;
	}
	
	function getName() : String 
	{
		return partname;
	}
	function setName(name : String){
		Ship.getShip(transform).unregisterPart(this,partname);
		Ship.getShip(transform).registerPart(this,name);
		partname = name;
	}
	
	function LoadPart(data : Field){
		Ship.getShip(transform).registerPart(this,partname);
		
		gameObject.SendMessage("setName",data.atField("Name").getString());
	
	}
	function Unload(){
		Ship.getShip(transform).unregisterPart(this,partname);
	
	}
}