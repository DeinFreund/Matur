#pragma strict
/*
var playerPrefab:GameObject;
var spawn:Transform;
var playerFilepath:String="clients/";
var playerlistFilepath:String="data/playerlist.dat";

var defaultMaxSpeed:float  = 5;
var defaultSpeed:float = 0;


private var players:List.<Player> = new List.<Player>();
private var componentManagers:List.<ComponentManager_S> = new List.<ComponentManager_S>();

function Start () {

}

function OnNetworkLoadedLevel() {

	if (Network.isClient) this.enabled = false;
}

@RPC
function Login(player:NetworkPlayer, name:String, psw:String){
	
	Debug.Log(name + " is trying to log in with password " + psw);
	
	name = name.ToUpper();
	var path:String = getPlayerPath(name);
	var playerdata:Field = new Field(FileIO.ReadFile(path));
	
	if (playerdata.getField("password") != null && playerdata.getField("password").getValue() == psw){
		Debug.Log(name + " authenticated. Assigning player object.");
		networkView.RPC("OnAuthenticated",player);
		
		for (var go : GameObject in FindObjectsOfType(GameObject))
		{
			//go.SendMessage("OnClientConnected", player,SendMessageOptions.DontRequireReceiver); 
			go.SendMessage("OnUserConnected", new MinimalUser(player, name), SendMessageOptions.DontRequireReceiver); 
		}
	}else{
		Debug.Log("Login request rejected.");
		networkView.RPC("OnAlert",player,"Wrong username/password");
	}
	
}

@RPC
function Register(player:NetworkPlayer, name:String, psw:String){
	
	Debug.Log(name + " is trying to register");
	var path:String = getPlayerPath(name);
	
	var playerdata:Field = new Field(FileIO.ReadFile(path));
	if (playerdata.length == 0){
		Debug.Log(name + " registered.");
		
		playerdata.atField("password").setValue(psw);
		
		FileIO.WriteFile(path,playerdata.getContent());	
		var namearr:String[] = new String[1];
		namearr[0] = name;
		FileIO.AttachFile(playerlistFilepath,namearr);
		LoadPlayer(name);
	}else{
		Debug.Log("Registration request rejected");
		networkView.RPC("OnAlert",player,"Name already in use");
	}
}

function getPlayerPath(name : String) : String{
	
	return playerFilepath + name + ".dat";
}

function DeletePlayer(name:String){
	
	var playerlist:String[] = FileIO.ReadFile(playerlistFilepath);
	var newlist:List.<String> = new List.<String>();
	for (var i : int = 0;  i < playerlist.length; i++){
		if (playerlist[i]!=name ){
			newlist.Add(playerlist[i]);
		}
	}
	FileIO.WriteFile(playerlistFilepath,newlist.ToArray());
	FileIO.DeleteFile(getPlayerPath(name));
}

function LoadPlayer(name:String) : GameObject{
	
	var path:String = getPlayerPath(name);
	var data:Field = FileIO.ReadFile(path);
	if (data.length == 0){
		DeletePlayer(name);
		return;
	}
	var offset: int = 1;
	var pos:Vector3 = FileIO.getVector(data,offset);
	offset+=3;
	var rot:Quaternion = FileIO.getQuaternion(data,offset);
	offset+=4;
	
	var player:GameObject = Network.Instantiate(playerPrefab, pos, rot,NetworkGroup.PLAYER);
	Debug.Log("Loading player "+ name);
	
	var pmanager : PlayerManager_S = player.GetComponent(PlayerManager_S);
	var cmanager : ComponentManager_S = player.GetComponent(ComponentManager_S);
	playerManagers.Add(pmanager);
	componentManagers.Add(cmanager);
	
	pmanager.speed = parseFloat(data[offset]);
	offset++;
	pmanager.maxSpeed = parseFloat(data[offset]);
	offset++;
	pmanager.username = name;
	
	offset = cmanager.LoadComponents(data,offset, pmanager);
	
	pmanager.Initialize();
	
	return player;
}
*/
function LoadPlayers(){
	
	/*var playerlist:String[] = FileIO.ReadFile(playerlistFilepath);
	for (var player:String in playerlist){
		LoadPlayer(player);
	}
	Debug.Log("All Players loaded.");*/
}