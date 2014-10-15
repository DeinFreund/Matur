#pragma strict

var playerFilepath:String="clients/";
var playerlistFilepath:String="data/playerlist.dat";


private var players:List.<Player> = new List.<Player>();
static private var connectedUsers : List.<MinimalUser> = new List.<MinimalUser>();

function Start () {

}

function OnNetworkLoadedLevel() {

	if (Network.isClient) this.enabled = false;
}

@RPC
function Login(player:NetworkPlayer, name:String, psw:String){
	
	psw = Md5Sum(psw);
	Debug.Log(name + " is trying to log in with password " + psw); 
	
	name = name.ToUpper();
	var path:String = getPlayerPath(name);
	var playerdata:Field = Field.newField(FileIO.ReadFile(path));
	
	if (playerdata.getField("password") != null && playerdata.getField("password").getValue() == psw){
		Debug.Log(name + " authenticated. Assigning player object.");
		networkView.RPC("OnAuthenticated",player);
		
		for (var go : GameObject in FindObjectsOfType(GameObject))
		{
			go.SendMessage("OnUserConnected", new MinimalUser(player, name), SendMessageOptions.DontRequireReceiver); 
		}
		for (var p : Player in players)
		{
			p.OnUserConnected(new MinimalUser(player, name));
		}
	}else{
		Debug.Log("Login request rejected - Wrong password or username");
		networkView.RPC("OnAlert",player,"Wrong username/password");
	}
	
}

@RPC
function Register(player:NetworkPlayer, name:String, psw:String){
	
	
	psw = Md5Sum(psw);
	Debug.Log(name + " is trying to register");
	var path:String = getPlayerPath(name);
	
	var playerdata:Field = Field.newField(FileIO.ReadFile(path));
	if (playerdata.size() == 0){
		Debug.Log(name + " registered.");
		
		playerdata = Presets.getAll().getClone();
		playerdata.atField("password").setValue(psw);
		playerdata.atField("username").setValue(name);
		
		FileIO.WriteFile(path,playerdata.getContent());	
		var namearr:String[] = new String[1];
		namearr[0] = name;
		FileIO.AttachFile(playerlistFilepath,namearr);
		LoadPlayer(name);
	}else{
		Debug.Log("Registration request rejected - Name already in use");
		networkView.RPC("OnAlert",player,"Name already in use");
	}
}

static function RequestConnectedUsers(target: GameObject){
	for (var m : MinimalUser in connectedUsers){
		target.SendMessage("OnUserConnected",m);
	}
}

function OnUserConnected(user : MinimalUser){
	connectedUsers.Add(user);
}

function OnPlayerDisconnected(nid : NetworkPlayer){
	Debug.Log("Player disconnected, clearing remaining RPC calls.");
	Network.RemoveRPCs(nid);
	for ( var i : int = 0; i < connectedUsers.Count; i++ ){
		if (connectedUsers[i].client == nid){
			connectedUsers.RemoveAt(i);
			break;
		}
	}
}

function getPlayerPath(name : String) : String{
	
	return playerFilepath + name + ".dat";
}

function getPlayerPath(player : Player) : String{
	
	return playerFilepath + player.getUsername() + ".dat";
}

function findPlayer(name : String) : Player{
	
	for (var p : Player in players){
		if (p.getUsername() == name) return p;
	}
	return null;
}

function findPlayer(player : NetworkPlayer) : Player{
	
	for (var p : Player in players){
		if (p.getNetworkPlayer().Equals(player)) return p;
	}
	return null;
}

//deserializes and sends a field to a Player object
@RPC
function sendToPlayer(player : NetworkPlayer, key : String, field : String){
	var p = findPlayer(player);
	if (p!=null){
		p.send(key,Field.newField(field));
	}else{
		Debug.LogWarning("Player not found");
	}
}

function DeletePlayer(name:String){
	
	UnloadPlayer(findPlayer(name));
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

function LoadPlayer(name:String){
	
	Debug.Log("Creating player "+ name);
	var path:String = getPlayerPath(name);
	var data:Field;
	try{
		data = Field.newField(FileIO.ReadFile(path));
		
	}catch (ex){
		Debug.LogError("Unable to load player's(" + (name) +") field: " + ex);
	}
	players.Add(new Player(data));
	
	
}

function LoadPlayers(){
	
	var playerlist:String[] = FileIO.ReadFile(playerlistFilepath);
	for (var player:String in playerlist){
		LoadPlayer(player);
	}
	Debug.Log("All Players loaded.");
}

function OnApplicationQuit(){
	GameObject.Find("_ScriptManager").SendMessage("Unload");
}

function Unload(){
	
	if (Network.isServer){
		UnloadPlayers();
	}
}

function UnloadPlayer(player : Player){
	
	Debug.Log("Unloading player "+ player.getUsername());
	player.Unload();
	FileIO.WriteFile(getPlayerPath(player),player.getData().getContent());
	players.Remove(player);
	
}

function UnloadPlayers(){
	while(players.Count > 0){
		UnloadPlayer(players[players.Count - 1]);
	}
	Debug.Log("All Players unloaded.");
}

static function Md5Sum(strToEncrypt: String) : String//Code from http://wiki.unity3d.com/index.php?title=MD5
{
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}