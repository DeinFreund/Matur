#pragma strict

class Engine extends MonoBehaviour implements Part
{
	private var accel : float = 0.0;//relative percentage of acceleration 0.0 - 1.0
	private var maxAccel : float = 15000.0; //maximal thrust
	
	
	private var sldSpeedRect: Rect = Rect(10,10,20,100);
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) Update_S();
		
	}
	
	function Start(){
		if (Network.isServer) Start_S();	
	}
	
	
	//////////
	//SERVER//
	//////////
	
	private var client : NetworkPlayer;
	private var data : Field;
	private var shipRigidbody : Rigidbody;
	
	function Start_S(){
		shipRigidbody = Ship.getShip(transform).getGameObject().rigidbody;
	}
	
	function OnUserConnected(user : MinimalUser){
		if (!transform.parent.GetComponent(Ship).getOwner().getUsername().ToUpper() == user.name.ToUpper()) return;
		
		this.client = user.client;
		networkView.RPC("setOwner",user.client);
	}
	
	
	function getType() :int 
	{
		
		return 2;
	}
	
	function Update_S(){
		if (!transform.parent) return;
		shipRigidbody.AddForceAtPosition(transform.forward * 1 *  accel * maxAccel * Time.deltaTime,transform.localPosition + transform.parent.position);
		
	}
	
	function LoadPart(field : Field){
		Debug.Log(field.getId());
		this.accel = field.getField("accel").getFloat();
		this.data = field;
	}
	
	function Unload(){
		data.getField("accel").setFloat(accel);
		
		Network.Destroy(networkView.viewID);
		
	}
	
	@RPC
	function setAccel(accel : float){
		this.accel = accel;
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
		window = Window.newWindow("Engine",gameObject,"OnWindow",200,200);
	}
	
	function OnGUI(){
		if (!isOwner) return;
		
	}

	function OnWindow(winId:int){
		oldAccel = accel;
		accel = GUI.VerticalSlider(sldSpeedRect,accel,1,0);
	}
	
	function Update_C(){
		if (accel != oldAccel) 
		{
			networkView.RPC("setAccel",RPCMode.Server,accel);
			GetComponentInChildren(EngineLight).accel = accel;
		}
	}
	
}