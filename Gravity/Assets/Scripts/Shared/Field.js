#pragma strict

public class Field//handles section of files
{
	private var fields : List.<Field>;
	private var names : List.<String>;//could be replaced by map for faster access
	private var content : List.<String>;
	
	public function Field(){
	
		fields = new List.<Field>();
		names = new List.<String>();
		content = new List.<String>();
	}
	
	//constructor
	public function Field(content : List.<String>){	
		fields = new List.<Field>();
		names = new List.<String>();
		this.content = content;
		
		
		for (var line : int = 0; line < content.Count; line ++){
			content[line] = content[line].Trim();
		}
		
		//parse content if not leaf
		if (content[0][0] != "="){
		
			
			//#Debug.Log("<<<<");
			for (line = 0; line < content.Count; line ++){
				if (content[line][0] == '<'){
					var name : String = content[line].Substring(1,content[line].Length - 2);
					var fieldContent : List.<String> = new List.<String>();
					//#Debug.Log("Found <" + name + ">");
					//#Debug.Log("Looking for " + String.Format("</{0}>",name) );
					
					line++;
					while(content[line] != String.Format("</{0}>",name)){
						//#Debug.Log(content[line]);
						fieldContent.Add(content[line]);
						line ++;
					}
					
					//#Debug.Log("End: " + content[line]);
					fields.Add(new Field(fieldContent));
					names.Add(name);
					//#Debug.Log("----");
				}else{
					//#Debug.Log("this is weird stuff: " + content[line]);
				}
			}
			//#Debug.Log(">>>>");
		}
	}
	
	public function Field(content : String[]){
		var list : List.<String>;
		
		for (var i: int = 0; i < content.length; i++){
			list.Add(content[i]);
		}
		Field(list);
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
	
	public function getValue() : String
	{
		if (content.Count > 0 && content[0][0] == "="){
			return content[0].Substring(1,content[0].Length - 1);
		}else{
			//Debug.LogError("Tried to read value of field that is no leaf");
			return "";
		}
		
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
		if (content.Count > 0 && content[0][0] == "="){
			return indent(content);
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
	
	
}