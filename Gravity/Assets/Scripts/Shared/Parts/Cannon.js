#pragma strict

class Cannon extends MonoBehaviour implements Part
{
	
	private var owner : Player;
	private var ammo : Field; //shipdata
	private var childSpawns : List.<Transform>;
	
	function getType() :int 
	{
		
		
		return 1;
	}
	
	function LoadPart(field : Field){
		if (transform.parent == null) Network.Destroy(networkView.viewID);
		
		
		Ship.getShip(transform).getOwner();
		
		childSpawns = new List.<Transform>();
		for (var child : Transform in transform)
		{
			if (child.tag=="BulletSpawn"){
				//Debug.Log(child);
				childSpawns.Add(child);
			}
		}
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