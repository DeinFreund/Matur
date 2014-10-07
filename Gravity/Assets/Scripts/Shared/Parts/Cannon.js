#pragma strict

class Cannon extends Part
{
	
	private var owner : Player;
	private var ammo : int; //shipdata(blueprint)
	//private var partname : String;
	private var childSpawns : List.<Transform>;
	private var data : Field;
	private var velocity : float = 15;
	private var ship : Ship;
	private var cooldown : float = 5.0;
	private var lastShot : float = 0;
	
	
	function getType() :int 
	{
		
		
		return 1;
	}
	
	
	function LoadPart(field : Field){
		if (transform.parent == null) Network.Destroy(networkView.viewID);
		
		ship = Ship.getShip(transform);
		owner = ship.getOwner();
		data = field;
		if (field.getField("cooldown"))
			cooldown = field.getField("cooldown").getFloat();
		
		childSpawns = new List.<Transform>();
		for (var child : Transform in (transform) )
		{
			if (child.tag=="BulletSpawn"){
				//Debug.Log(child);
				childSpawns.Add(child);
			}
		}
		ammo = 0;
		super(field);
		
	}
	
	function Unload(){
		super();
		data.getField("Name").setString(partname);
		data.atField("cooldown").setFloat(cooldown);
	}
	 
	 
	function OnGUI(){
		if (GUI.Button(new Rect(100,100,150,50),"Fire da gun")){
			gameObject.SendMessage("Fire");
		}
	}
	
	function Fire(){
		if (Time.time - lastShot < cooldown) return;
		lastShot = Time.time;
		var radars = Ship.getShip(transform).getParts(3);
		var trg : Transform;
		if (radars.Count == 0) {
			trg = null;
		}else{
			trg = (radars[0] as Radar).getTarget();
		}
		Missile.newMissile(ammo,childSpawns[0].position,childSpawns[Random.Range(0,childSpawns.Count)].rotation,transform.up*velocity+ship.rigidbody.velocity,trg);
		//Ship.newShip(owner,ammo,childSpawns[0].position, childSpawns[0].rotation);
	}
}