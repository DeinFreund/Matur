#pragma strict

class Engine extends Part
{
	private var accel : float = 0.0;//relative percentage of acceleration 0.0 - 1.0
	private var maxAccel : float = 15000.0; //maximal thrust
	
	
	private var sldSpeedRect: Rect = Rect(10,10,20,100);
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) Update_S();
		
	}
	
	
	
	//////////
	//SERVER//
	//////////
	
	
	private var client : NetworkPlayer;
	private var data : Field;
	private var shipRigidbody : Rigidbody;
	////private var partname : String;
	private var clientOnline : boolean = false;
	
	function OnUserConnected(user : MinimalUser){
		if (!Ship.getShip(transform)) return;
		
		if (Ship.getShip(transform).getOwner().getUsername().ToUpper() != user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setOwner",user.client);
		clientOnline = true;
	}
	
	function OnPlayerDisconnected(player : NetworkPlayer){
		if (client != player) return;
		clientOnline = false;
	}
	
	function getType() :int 
	{
		
		return 2;
	}
	
	
	function getName() : String 
	{
		return partname;
	}
	
	function Update_S(){
		if (!transform.parent) return;
		//Debug.Log(shipRigidbody);
		shipRigidbody.AddForceAtPosition(transform.forward * 1 *  accel * maxAccel * Time.deltaTime,transform.position);//transform.localPosition + transform.parent.position
		
	}
	
	function LoadPart(field : Field){
		//Debug.Log(field.getId());
		setAccel( field.atField("accel").getFloat());
		this.data = field;
		shipRigidbody = Ship.getShip(transform).getGameObject().rigidbody;
		super(field);
	}
	
	function Unload(){
		super();
		data.getField("accel").setFloat(accel);
		data.getField("Name").setString(partname);
		
		networkView.RPC("UnloadClient",RPCMode.Others);
		
	}
	
	
	@RPC
	function setAccel(accel : float){
		if (accel < 0){
			Debug.LogWarning("Invalid acceleration: " + accel);
			return;
		} 
		this.accel = accel;
		networkView.RPC("confirmAccel",RPCMode.OthersBuffered,accel);
	}

	//////////
	//CLIENT//
	//////////
	
	
	private var isOwner : boolean = false;
	private var window : Window;
	private var oldAccel : float = -1;
	
	@RPC 
	function setOwner(){
	
		isOwner = true;
		//window = Window.newWindow("Engine",gameObject,"OnWindow",200,200);
	}
	
	@RPC
	function UnloadClient(){
		//window.Unload();
	}
	
	function OnGUI(){
		if (!isOwner) return;
		
	}

	function OnWindow(winId:int){
		//oldAccel = accel;
		//accel = GUI.VerticalSlider(sldSpeedRect,accel,1,0);
	}
	
	function Update_C(){
		/*if (accel != oldAccel) 
		{
			networkView.RPC("setAccel",RPCMode.Server,accel);
		}*/
	}
	
	@RPC
	function confirmAccel(accel : float){
		this.accel = accel;
		oldAccel = accel;
		GetComponentInChildren(EngineLight).accel = accel;
	}
	
}