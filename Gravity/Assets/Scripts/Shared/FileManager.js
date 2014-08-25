#pragma strict


class FileManager extends MonoBehaviour
{

	//////////
	//SERVER//
	//////////
	
	private var owner : Player;
	private var data : Field;
	
	//constructed by server
	static function newFileManager (go : GameObject, data : Field, owner: Player) : FileManager{
		
		if (! Network.isServer) {
			Debug.LogError("File Manager has to be instantiated on server side");
			return null;
		}
		if (! go.networkView){
			Debug.LogError("File Manager on local object");
			return null;
		}
		var fm : FileManager = go.AddComponent(FileManager);
		
  		
  		fm.owner = owner;
  		
  		return fm;
  		
	}
	
	function Update(){
		if (Network.isClient) Update_C();
		if (Network.isServer) Update_S();
	}
	
	public function OnOwnerConnected(){
		Debug.Log("Enabling File Manager");
		networkView.RPC("AddFileManager",owner.getNetworkPlayer());
	}
	
	private function Update_S(){
		
	}
	
	//////////
	//CLIENT//
	//////////
	
	final private static var btnOpen : Rect = new Rect(140,30,100,30);
	final private static var txtFilename : Rect = new Rect(20,30,100,30);
	final private static var lblFiles : Rect = new Rect(20,80,200,150);
	final private static var windowWidth : int = 260;
	final private static var windowHeight : int = 250;
	final private static var listUpdateTime : float = 1;
	
	private var lblFilesString : String = "";
	private var txtFilenameString : String = "";
	private var btnOpenText : String = "Open";
	private var lastUpdateTime : float = Time.time;
	
	static function newFileManagerClient (go : GameObject) : FileManager{
	
		
		if (! Network.isClient) {
			Debug.LogError("File Manager Client has to be instantiated on client side");
			return null;
		}
		if (! go.networkView){
			Debug.LogError("File Manager on local object");
			return null;
		}
		
		Debug.Log("Enabling File Manager");
		
		var fm : FileManager = go.AddComponent(FileManager);
  		Window.newWindow("My Files",go,"OnFileManagerWindow",windowWidth,windowHeight);
		
		return fm;
	}
	
	private function Update_C() {
		// D I S A B L E D
		if (false && Time.time - lastUpdateTime > listUpdateTime){
			//update file list
			lastUpdateTime = Time.time;
			var ls : List.<String> = data.getNames();
			lblFilesString = "";
			for (var str : String  in ls){
				lblFilesString += str + " ";
			}
		}
	}
	
	function OnGUI(){
		
	}
	
	
	function OnFileManagerWindow(){
		
		
		GUI.Label(lblFiles,lblFilesString);
		GUI.TextField(txtFilename,txtFilenameString);
		if (GUI.Button(btnOpen, btnOpenText)){
			
		}
	}
	
}