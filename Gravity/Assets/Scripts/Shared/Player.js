#pragma strict

public class Player extends MonoBehaviour
{
	var client : NetworkPlayer;
	var username : String;
	var partManager : PartManager;
	var savefile : Field;
	var ships : List.<Ship>;
	
	//constructor
	function Player(username: String){
		this.username = username;
		this.client = Network.player; // initialize to own player as it can't be null
		savefile = new Field(new List.<String>(FileIO.ReadFile("test.txt")));
		for (var field : Field in savefile.getFields("Ship")){
			ships.Add(Ship.newShip(this,field));
		}
	}
	
	function Update(){
		if (Network.isServer) Update_S();
		if (Network.isClient) Update_C();
	}
	
	function Update_S(){
	
	}
	
	function Update_C(){
	
	}
	
	//the owner of this player has logged in
	function OnUserConnected(user : MinimalUser){
		if (!this.username.ToUpper() == user.name.ToUpper()) return;
		
		this.client = user.client;
		
	}
	
	
	
}