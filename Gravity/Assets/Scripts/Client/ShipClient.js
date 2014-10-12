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
	private var playership : GameObject;
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
			if (renderer.isVisible){
				var posVector : Vector3 = Camera.main.WorldToScreenPoint(radarGuiTex3DPos + playership.transform.position);
				posVector.x = posVector.x / Screen.width;
				posVector.y =  posVector.y / Screen.height;
				radarGuiTex.position = posVector;
			}else{
				radarGuiTex.position = new Vector3(2f,2f,2f);
			}
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
	function setRadarTex(val : boolean, selected : boolean, parent : NetworkViewID){
		if (val && (!radarGuiTex || selected != radarSelected) ) {
			if (radarGuiTex) Destroy(radarGuiTex.gameObject);
			if (selected) radarGuiTex = Instantiate(Prefabs.getRadarGuiSelectedTexture(),transform.position,transform.rotation);
			else radarGuiTex = Instantiate(Prefabs.getRadarGuiTexture(),transform.position,transform.rotation);
			radarSelected = selected;
		}
		if (!val && radarGuiTex) Destroy(radarGuiTex.gameObject);
		playership = networkView.Find(parent).gameObject;
		radarGuiTex3DPos = transform.position - playership.transform.position;
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
		networkView.Find(childId).transform.parent = transform;
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
