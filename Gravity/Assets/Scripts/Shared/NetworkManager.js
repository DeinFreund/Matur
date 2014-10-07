#pragma strict
var btnNetworkHostX:int=10;
var btnNetworkHostY:int=10;
var btnNetworkHostW:int=100;
var btnNetworkHostH:int=20;
var btnNetworkConnectX:int=10;
var btnNetworkConnectY:int=30;
var btnNetworkConnectW:int=100;
var btnNetworkConnectH:int=20;
var txtIPX:int=10;
var txtIPY:int=50;
var txtIPW:int=100;
var txtIPH:int=20;
var txtPortX:int=110;
var txtPortY:int=50;
var txtPortW:int=50;
var txtPortH:int=20;
var txtUsernameX:int=10;
var txtUsernameY:int=50;
var txtUsernameW:int=100;
var txtUsernameH:int=20;
var txtPasswordX:int=10;
var txtPasswordY:int=80;
var txtPasswordW:int=100;
var txtPasswordH:int=20;
var lblAlertX:int=10;
var lblAlertY:int=170;
var lblAlertW:int=100;
var lblAlertH:int=20;
var lblAlertStyle:GUIStyle = new GUIStyle();
var btnLoginX:int=10;
var btnLoginY:int=110;
var btnLoginW:int=100;
var btnLoginH:int=20;
var btnRegisterX:int=10;
var btnRegisterY:int=140;
var btnRegisterW:int=100;
var btnRegisterH:int=20;
var netIP:String = "127.0.0.1";
var netPort:int = 12345;
var useNAT:boolean = false;
var username:String = "";
var password:String = "";
var alert:String = "Started";
var alertDisplayTime:float = 5;


private var alertTime:float = 2;
private var authenticated:boolean = false;

function mywin(winId : int){
	GUI.TextField(new Rect(txtUsernameX,txtUsernameY,txtUsernameW,txtUsernameH),username);
}

function Start () {
	
	
	if (useNAT) Debug.LogError("NAT throughpunch is not (yet) implemented.");
}

function Update () {
	
	if (alertTime > 0){
		alertTime -= Time.deltaTime;
	}
}

function OnGUI(){
	
	if (alertTime > 0){
		GUI.Label(new Rect(lblAlertX,lblAlertY,lblAlertW,lblAlertH),alert,lblAlertStyle);
	}
	if (Network.isClient){
		
		if (!authenticated ){
			if (!Application.isLoadingLevel && GUI.Button (new Rect(btnLoginX,btnLoginY,btnLoginW,btnLoginH),"Login"))
			{
				alertTime = -1;
				Debug.Log("Logging in with username: " + username + " Password:" + password);
				networkView.RPC("Login",RPCMode.Server,Network.player,username,password);
				
			}
			if (GUI.Button (new Rect(btnRegisterX,btnRegisterY,btnRegisterW,btnRegisterH),"Register"))
			{
				alertTime = -1;
				Debug.Log("Registering with username: " + username + " Password:" + password);
				networkView.RPC("Register",RPCMode.Server,Network.player,username,password);
				
			}
			username = GUI.TextField(new Rect(txtUsernameX,txtUsernameY,txtUsernameW,txtUsernameH),username);
			password = GUI.TextField(new Rect(txtPasswordX,txtPasswordY,txtPasswordW,txtPasswordH),password);
		}
		
	}else if (Network.isServer){
		
	}else{
		
		if (GUI.Button (new Rect(btnNetworkConnectX,btnNetworkConnectY,btnNetworkConnectW,btnNetworkConnectH),"Connect"))
		{
			Debug.Log("Connecting to Server @ " + netIP + ":" + netPort);
			Network.Connect(netIP, netPort);
			
		}
		if (GUI.Button (new Rect(btnNetworkHostX,btnNetworkHostY,btnNetworkHostW,btnNetworkHostH),"Start Server"))
		{	
			Network.InitializeSecurity();
			Network.InitializeServer(32, netPort, useNAT);
			Debug.Log("Hosting Server");
			GlobalVars.BeforeNetworkLoadedLevel();
			Presets.BeforeNetworkLoadedLevel();
			for (var go : GameObject in FindObjectsOfType(GameObject))
			{
				go.SendMessage("BeforeNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver); 
			}
			
			GetComponent(WorldGen).Generate();
			GetComponent(AccountManager_S).LoadPlayers();
			for (var go : GameObject in FindObjectsOfType(GameObject))
			{
				go.SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver); 
			}
		}
		
		netIP = GUI.TextField(new Rect(txtIPX,txtIPY,txtIPW,txtIPH),netIP);
		netPort = parseInt(GUI.TextField(new Rect(txtPortX,txtPortY,txtPortW,txtPortH),netPort.ToString()));
	}
}



@RPC
function OnAuthenticated(){
	Debug.Log("Sucessfully authenticated on Server");
	authenticated = true;
	for (var go : GameObject in FindObjectsOfType(GameObject))
	{
		go.SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver); 
	}
}


@RPC
function OnAlert(msg:String){
	Debug.Log("Alert received: " + msg);
	alert = msg;
	alertTime = alertDisplayTime;
}

