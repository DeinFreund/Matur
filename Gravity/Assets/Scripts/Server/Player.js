#pragma strict

public class Player
{
	var client : NetworkPlayer;
	var username : String;
	var partManager : PartManager;
	var savefile : Field;
	var ships : List.<Ship>;
	var files : FileManager;
	
	//constructor
	function Player(data: Field){
		ships = new List.<Ship>();
	
		this.username = data.getField("Username").getValue();
		this.client = Network.player; // initialize to own player as it can't be null
		savefile = data;
		for (var f: Field in savefile.getFields("Ship")){
			ships.Add(Ship.newShip(this,f));
		}
		if (ships.Count == 0){
			var f : Field = Presets.getShip();
			savefile.addField("Ship",f.getContent());
			
			ships.Add(Ship.newShip(this,savefile.getField("Ship")));
			ships[(ships.Count - 1)].setMain(true);
		}
		
		files = FileManager.newFileManager(ships[0].getGameObject(),data.atField("Files"),this);
	}
	
	function Update(){
		if (Network.isClient){
			Debug.LogError("This class is used by the server only.");
			return;
		}
		
		
	}
	
	function getNetworkPlayer() : NetworkPlayer{
		return client;
	}
	
	function getUsername() : String{
		return username;
	}
	
	function Unload(){
	
		for (var s : Ship in ships){
			s.Unload();
		}
	}
	
	function getData() : Field
	{
		return savefile;
	}
	
	function addShip(ship : Ship){
		ships.Add(ship);
		savefile.addField("Ship",ship.getData().getContent());
	}
	
	//the owner of this player has logged in
	function OnUserConnected(user : MinimalUser){
		if (this.username.ToUpper() != user.name.ToUpper()) return;
		
		this.client = user.client;
		for (var s : Ship in ships){
			s.OnOwnerConnected();
		}
		files.OnOwnerConnected();
	}
	
	
	
}