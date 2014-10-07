#pragma strict


public class ShipClient extends MonoBehaviour
{
	//enables RPC communication to any ship on clientside
	
	//////////
	//CLIENT//
	//////////
	
	private static final var debugWindowHeight :int = 190;
	private static final var debugWindowWidth :int= 140;
	private static final var debugTextRect : Rect = Rect(20,20, 100, 110);
	private static final var debugClearRect : Rect = Rect(20,150,100,20);
	private static final var debugClearText : String = "Clear Output";
	
	static private var ships : List.<ShipClient>;
	
	private var radarGuiTex : Transform	;
	private var radarGuiTex3DPos : Vector3;
	private var radarSelected : boolean;
	private var controlled : boolean = false;
	private var debugWindow : Window;
	private var debugText : String = "";
	private var health : float;
	private var maxHealth : float;
	
	static public function getShips() : List.<ShipClient>{
		return ships;
	}
	
	private var emission : float = 100;
	
	
	function Start(){
		if (ships==null) ships = new List.<ShipClient>();
		
		ships.Add(this);
	}
	
	function OnNetworkLoadedLevel(){
		if (Network.isClient){
			gameObject.AddComponent(ShipServerRPCs);
		}
	}
	
	function Update(){
		
		
		if (Network.isClient) Update_C();
		if (Network.isServer) enabled = false;
		
	}
	
	function Update_C(){
	
		if (radarGuiTex) {
			//might be replaced by flare for better performance
			//pos updates shouldn't be called seperately for every radar blob
			var posVector : Vector3 = Camera.main.WorldToScreenPoint(radarGuiTex3DPos);
			posVector.x = posVector.x / Screen.width;
			posVector.y =  posVector.y / Screen.height;
			radarGuiTex.position = posVector;
		}
	}
	
	public function getEmission() : float{
		return emission;
		
	}
	
	public function OnDebugWindow(){
		GUI.TextField(debugTextRect,debugText);
		if (GUI.Button(debugClearRect,debugClearText)){
			debugText = "";
		}
	}
	
	
	
	
	@RPC
	function setRadarTex(val : boolean, selected : boolean){
		if (val && (!radarGuiTex || selected != radarSelected) ) {
			if (selected) radarGuiTex = Instantiate(Prefabs.getRadarGuiSelectedTexture(),transform.position,transform.rotation);
			else radarGuiTex = Instantiate(Prefabs.getRadarGuiTexture(),transform.position,transform.rotation);
			radarSelected = selected;
		}
		if (!val && radarGuiTex) Destroy(radarGuiTex.gameObject);
		radarGuiTex3DPos = transform.position;
	}
	
	@RPC
	function setVelocity(pos : Vector3, rot : Vector3){
		rigidbody.velocity = pos;
		rigidbody.angularVelocity = rot;
	}
	
	@RPC
	function setEmission(emission : float){
		if (emission < 0) {
			Debug.LogWarning("Invalid emission: " + emission);
			return;
		} 
		this.emission = emission;
	}
	
	@RPC
	function Enable(){
		Debug.Log("clientsided controls on ship enabled");
		Camera.main.GetComponent(MouseOrbit).setTarget(transform);
		Camera.main.transform.parent = transform;
		controlled = true;
		debugWindow = Window.newWindow("Lua Output",gameObject,"OnDebugWindow",debugWindowWidth,debugWindowHeight);
		gameObject.AddComponent(Healthbar);
	}
	
	@RPC
	function setHealth(hp : float, maxhp : float){
		health = hp;
		maxHealth = maxhp;
		(GetComponent(Healthbar) as Healthbar).health = health/maxHealth;
	}
	
	@RPC
	function SetPartParent(childId : NetworkViewID){
		Debug.Log("set parent");
		for (var go : GameObject in FindObjectsOfType(GameObject)){
			if (go.networkView != null && go.networkView.viewID == childId){
				go.transform.parent = transform;
			}
		}
	}
	
	@RPC
	function AddFileManager(){
		
		FileManager.newFileManagerClient(gameObject);
	}
	
	@RPC 
	function PrintToClient(str : String){
		if (!controlled) return;
		debugText = str + debugText;
	}
	

}
