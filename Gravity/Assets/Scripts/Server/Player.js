#pragma strict

public class Player
{
	var client : NetworkPlayer;
	var username : String;
	var partManager : PartManager;
	var savefile : Field;
	var ships : List.<Ship>;
	var files : FileManager;
	var online : boolean = false;
	
	//constructor
	function Player(data: Field){
		ships = new List.<Ship>();
	
		this.username = data.getField("Username").getValue();
		this.client = Network.player; // initialize to own player as it can't be null
		savefile = data;
		var hasMain : boolean = false;
		for (var f: Field in savefile.getFields("Ship")){
			var s : Ship = Ship.newShip(this,f);
			ships.Add(s);
			if (s.isMain()) hasMain = true;
		}
		
		if (ships.Count == 0){
			var f : Field = Presets.getShip();
			savefile.addField("Ship",f.getContent());
			
			ships.Add(Ship.newShip(this,savefile.getField("Ship")));
			
		}
		if (!hasMain){
			ships[0].setMain(true);
			
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
	
	function isConnected() : boolean{
		return online;
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
	
	function send(key : String, data : Field){
		Debug.Log("got message " + key + ":\n" + data.getContent());
		if (key.ToUpper().Equals("HOTKEYS")){
			savefile.removeField("hotkeys");
			savefile.addField("hotkeys",data.getContent());
		}
		if (key.ToUpper().Equals("LUACMD")){
			for(var ship in ships){
				if (ship.isMain()){
					Debug.Log("executing " + data.getString());
					ship.getShipAI().executeString(data.getString());
				}
			}
		}
	}
	
	//the owner of this player has logged in
	function OnUserConnected(user : MinimalUser){
		if (this.username.ToUpper() != user.name.ToUpper()) return;
		
		online = true;
		this.client = user.client;
		for (var s : Ship in ships){
			s.OnOwnerConnected();
		}
		files.OnOwnerConnected();
		//send hotkeys
		GameObject.Find("_ScriptManager").networkView.RPC("setField",user.client,savefile.atField("hotkeys").serialize());
	}
	
	
	
}