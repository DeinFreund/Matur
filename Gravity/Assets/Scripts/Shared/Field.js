#pragma strict

public class Field//handles section of files
{
	private var fields : List.<Field>;
	private var names : List.<String>;//could be replaced by map for faster access
	private var content : List.<String>;
	
	private var id : int;
	private static var counter : int = 0;
	
	public function Field(){
	
		fields = new List.<Field>();
		names = new List.<String>();
		content = new List.<String>();
		id = counter; counter++;
	}
	
	//constructor
	public function Field(list : List.<String>){	
		id = counter; counter++;
	
		this.fields = new List.<Field>();
		this.names = new List.<String>();
		this.content = getClone(list);
		
		for (var line : int = 0; line < content.Count; line ++){
			content[line] = content[line].Trim();
		}
		
		//parse content if not leaf
		if (!isLeaf()){
		
			
			//#Debug.Log("<<<<");
			for (line = 0; line < content.Count; line ++){
				if (content[line].Length == 0) continue;
				if (content[line][0] == '<'){
					var name : String = content[line].Substring(1,content[line].Length - 2);
					var fieldContent : List.<String> = new List.<String>();
					//#Debug.Log(id + " Found <" + name + ">");
					//#Debug.Log("Looking for " + String.Format("</{0}>",name) );
					
					var depth : int = 1;
					while(depth > 0 ){
						line ++;
						if (line >= content.Count) Debug.LogError(id + " Index out of range: " + line + "/" + content.Count);
						if (content[line] == String.Format("</{0}>",name)) depth --;
						if (content[line] == String.Format("<{0}>",name)) depth ++;
						if (depth > 0) {
							fieldContent.Add(content[line]);
							//#Debug.Log(id + ": " + content[line]);
						}
						//#Debug.Log(depth);
					}
					
										
					//#Debug.Log(id + " End: " + content[line]);
					fields.Add(new Field(fieldContent));
					names.Add(name);
					//#Debug.Log("----");
				}else{
					//#Debug.Log("this is weird stuff: " + content[line]);
				}
			}
			//#Debug.Log(">>>>");
		}else{
			//#Debug.Log(id + " Found Content: " + getValue());
			//#Debug.Log(id + " is leaf: " + isLeaf());
		}
		getContent();
	}
	
	public static function newField(content : String[]){
		var list : List.<String> = new List.<String>();
		
		for (var i: int = 0; i < content.length; i++){
			list.Add(content[i]);
		}
		return new Field(list);
	}
	
	public function size() : int{
		return fields.Count;
	}
	
	private function getClone(content : List.<String>):List.<String>{
		var list : List.<String> = new List.<String>();
		
		for (var i: int = 0; i < content.Count; i++){
			list.Add(content[i]);
		}
		return list;
	}
	
	//returns first field with specified name
	//if no such field exists, null is returned
	public function getField(name : String) : Field{
		var arr : List.<Field> = getFields(name);
		if (arr.Count > 0)
			return arr[0];
		return null;
	}
	
	//returns first field with specified name
	//if no such field a new one is created and returned
	public function atField(name : String) : Field{
	
		if (getField(name) != null) return getField(name);
		return addField(name);
	}
	
	public function getFields(name : String) : List.<Field>{
		
		var result : List.<Field> = new List.<Field>();
		
		for (var i : int = 0; i < fields.Count; i++){
			if (names[i].ToUpper() == name.ToUpper()){
				result.Add(fields[i]);
			}
		}
		
		return result;
	}
	
	public function isLeaf() : boolean
	{
		//Debug.Log(getId() + " is leaf: " + (content.Count > 0 && content[0].Length > 0 && content[0][0] == "="));
		return content.Count > 0 && content[0].Length > 0 && content[0][0] == "=";
	
	}
	
	//for debugging purposes only
	public function getId() : int
	{
		return id;
	}
	
	public function getValue() : String
	{
		if (isLeaf()){
			return content[0].Substring(1,content[0].Length - 1);
		}else{
			Debug.LogWarning(id + " Tried to read value of field that is no leaf");
			return "";
		}
		
	}
	
	
	public function setValue(val : String){
		content = new List.<String>();
		content.Add(String.Format("={0}",val));
	}
	
	public function addField(name : String, content : List.<String>) : Field{
	
		fields.Add(new Field(content));
		names.Add(name);
		return fields[fields.Count - 1];
	}
	public function addField(name : String) : Field{
	
		fields.Add(new Field());
		names.Add(name);
		return fields[fields.Count - 1];
	}
	
	public function getContent() : List.<String>{
		//Debug.Log("getting content of " + id);
		FileIO.WriteFile("data/field" + id + ".txt", content);
		if (isLeaf()){
			return indent(getClone(content));
		}else{
			var content : List.<String> = new List.<String>();
			for (var i : int = 0; i < fields.Count; i++){
				content.Add(String.Format("<{0}>",names[i]));
				content.AddRange(fields[i].getContent());
				content.Add(String.Format("</{0}>",names[i]));
			}
			return indent(content);
		}
	}
	
	//to get a nicer looking output file
	private function indent(text : List.<String>) : List.<String>{
		for (var line : int = 0; line < text.Count; line ++){
			text[line] = "\t" + text[line];
		}
		return text;
	}
	
	// ----
	// custom functions for use with unity
	
	public function setVector3(vec : Vector3){
		atField("x").setValue(vec.x.ToString());
		atField("y").setValue(vec.y.ToString());
		atField("z").setValue(vec.z.ToString());
	}
	public function getVector3() : Vector3{
		var vec : Vector3 = new Vector3();
		vec.x = atField("x").getFloat();
		vec.y = atField("y").getFloat();
		vec.z = atField("z").getFloat();
		return vec;
	}
	
	public function setInt(val : int){
		setValue(val.ToString());
	}
	public function getInt() : int{
		if (getValue() != ""){
			try{
				return parseInt(getValue());
			}catch( ex ){
				return 0;
			}
		}else{
			return 0;
		}
	}
	
	public function setFloat(val : float){
		setValue(val.ToString());
	}
	public function getFloat() : float{
		if (getValue() != ""){
			try{
				return parseFloat(getValue());
			}catch( ex ){
				return 0f;
			}
		}else{
			return 0f;
		}
	}
	
	public function setBoolean(val : boolean){
		if (val){
			setValue("true");
		}else{
			setValue("false");
		}
	}
	public function getBoolean() : boolean{
		if (getValue().ToUpper() == "TRUE"){
			return true;
		}else{
			return false;
		}
	}
	
}