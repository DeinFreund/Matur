#pragma strict

class Cannon extends Part
{
	
	private var owner : Player;
	private var ammo : Field; //shipdata(blueprint)
	//private var partname : String;
	private var childSpawns : List.<Transform>;
	private var data : Field;
	
	function getType() :int 
	{
		
		
		return 1;
	}
	
	function getName() : String 
	{
		return partname;
	}
	function setName(name : String){
		partname = name;
	}
	
	function LoadPart(field : Field){
		if (transform.parent == null) Network.Destroy(networkView.viewID);
		
		gameObject.SendMessage("setName",field.atField("Name").getString());
		owner = Ship.getShip(transform).getOwner();
		data = field;
		
		childSpawns = new List.<Transform>();
		for (var child : Transform in (transform) )
		{
			if (child.tag=="BulletSpawn"){
				//Debug.Log(child);
				childSpawns.Add(child);
			}
		}
	}
	
	function Unload(){
		data.getField("Name").setString(partname);
	}
	 
	 
	function OnGUI(){
		if (GUI.Button(new Rect(100,100,150,50),"Fire da gun")){
			gameObject.SendMessage("Fire");
		}
	}
	
	function Fire(){
		ammo = Blueprints.getBlueprint(0);
		Ship.newShip(owner,ammo,childSpawns[0].position, childSpawns[0].rotation);
	}
}