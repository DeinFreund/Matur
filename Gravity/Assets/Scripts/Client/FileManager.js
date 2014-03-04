#pragma strict

#pragma strict

class FileManager extends MonoBehaviour
{
	final private static var btnOpen : Rect = new Rect(140,30,100,30);
	final private static var txtFilename : Rect = new Rect(20,30,100,30);
	final private static var lblFiles : Rect = new Rect(20,80,200,150);
	final private static var windowWidth : int = 260;
	final private static var windowHeight : int = 250;
	final private static var listUpdateTime : float = 1;
	
	private var lblFilesString : String = "";
	private var lastUpdateTime : float = Time.time;
	private var data : Field;

	static function newFileManager (go : GameObject, data : Field) : FileManager{
	
		var fm : FileManager = go.AddComponent(FileManager);
  		Window.newWindow("My Files",go,"OnFileManagerWindow",windowWidth,windowHeight);
  		
	}
	
	
	
	function Update () {
		
		if (Time.time - lastUpdateTime > listUpdateTime){
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
	}
	
}