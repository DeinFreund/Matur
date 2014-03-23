#pragma strict


public class ShipClient extends MonoBehaviour
{
	//enables RPC communication to any ship on clientside
	
	static private var ships : List.<ShipClient>;
	
	private var radarGuiTex : Transform	;
	private var radarGuiTex3DPos : Vector3;
	
	static public function getShips() : List.<ShipClient>{
		return ships;
	}
	
	private var emission : float = 100;
	
	
	function Start(){
		if (ships==null) ships = new List.<ShipClient>();
		
		ships.Add(this);
	}
	
	function Update(){
		
		
		if (Network.isClient) Update_C();
		//if (Network.isServer) enabled = false;
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
	
	@RPC
	function setRadarTex(val : boolean){
		if (val && ! radarGuiTex ) radarGuiTex = Instantiate(Prefabs.getRadarGuiTexture(),transform.position,transform.rotation);
		if (!val && radarGuiTex) Destroy(radarGuiTex);
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
		Camera.main.GetComponent(MouseOrbit).target = transform;
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
}
