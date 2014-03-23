#pragma strict

class Radar extends MonoBehaviour implements Part
{
	
	function Update(){
		if (Network.isServer) Update_S();
	}
	
	//////////
	//SERVER//
	//////////
	
	private var captureFreq : float = 5;
	private var lastCapture : float ;
	private var data : Field;
	private var client : NetworkPlayer;
	private var clientOnline : boolean = false;
	private var sensorData : float[];
	private var ships : List.<Ship>;
	private var exposureCounter : int = 0;
	private var lastExposure : int;
	private var exposureTime : int = 5;
	private var sensitivityThreshold : float = 0.1;
	
	
	function LoadPart(field : Field){
		data = field;
		sensitivityThreshold = field.getField("sensitivityThreshold").getFloat();
	
	}
	
	function Update_S(){
		if (Time.time - lastCapture > 1f / captureFreq) Capture();
	}
	
	function Capture(){
		lastCapture = Time.time;
		exposureCounter ++;
		if (ships == null || exposureCounter - lastExposure > exposureTime){
			lastExposure = exposureCounter;
			ships = Ship.getShips();
			Debug.Log("Shutter ");
			if (clientOnline) {
				for (var i : int = 0; i < ships.Count; i++){
					ships[i].getGameObject().networkView.RPC("setRadarTex", client, sensorData[i] > sensitivityThreshold);
				}
				
				
			}
			sensorData = new float[ships.Count];
			
		}
		for (i = 0; i < ships.Count; i++){
			sensorData[i] += ships[i].getEmission() / Mathf.Pow(Vector3.Distance(transform.position,ships[i].transform.position),2f);
		}
	}
	
	function OnUserConnected(user : MinimalUser){
	
		if (!Ship.getShip(transform)) return;
		if (Ship.getShip(transform).getOwner().getUsername().ToUpper() != user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setOwner",user.client);
		Debug.Log("Enabling "  + user.name + "'s radar");
		clientOnline = true;
	}
	
	function getType() : int{
		return 3;
	}
	
	@RPC
	function setExposure(exp : int){
		if ( exp <= 0){
			Debug.LogError("Invalid exposure time: " + exp);
			return;
		}
		exposureTime = exp;
	}
	
	
	//////////
	//CLIENT//
	//////////
	
	final private static var lblData : Rect = new Rect(20,20,200,150);
	final private static var lblExp : Rect = new Rect(220,20,150,20);
	final private static var lblExpText : String = "Exposure time:";
	final private static var txtExp : Rect = new Rect(220,50,150,20);
	final private static var btnExp : Rect = new Rect(220,80,50,20);
	final private static var btnExpText : String = "Apply";
	private var expTime : int = -1;
	private var txtExpText : String = "0.2";
	
	private var window : Window;
	
	@RPC
	function setOwner(){
		window = Window.newWindow("Radar",gameObject,"OnWindow",390,200);
	}
	
	function OnWindow(){
		/*
		var text : String = "";
		for (var i = 0; i < sensorDataClient.length; i++){
			text += (sensorDataClient[i]) + "\n";
		}
		GUI.Label(lblData,text);
		*/
		GUI.Label(lblExp,lblExpText);
		
	    txtExpText = GUI.TextField(txtExp, txtExpText);
	    if (GUI.Button(btnExp,btnExpText)){
	    
			var oldExp = expTime;
		    var temp : float = 0;
		    if (float.TryParse(txtExpText, temp))
		    {
		        expTime = (Mathf.Max(0.2, temp)*5+0.5);
		        
		    }
		    else if (txtExpText == "") expTime = 1;
		    txtExpText = (expTime/5.0).ToString();
		    
	    	if (expTime != oldExp) networkView.RPC("setExposure",RPCMode.Server, expTime);
	    }
		
	}
	
}