#pragma strict
static final var blueprintsFilepath = "data/blueprints.dat";

static var data : Field;


function OnNetworkLoadedLevel () {
	
	data = new Field.newField(FileIO.ReadFile(blueprintsFilepath));
	
}

function Unload(){

	if (! Network.isServer) return;
	FileIO.WriteFile(blueprintsFilepath,data.getContent());
	Debug.Log("Saved blueprints");
}

static function addBlueprint(ship : Ship){
	var id : int = data.atField("size").getInt();
	data.getField("size").setInt(id + 1);
	
	var field : Field = ship.getData();
	field.removeField("main");
	field.atField("blueprintID").setInt(id);
	data.addField("Ship",field.getContent());
}

static function getBlueprint(id : int) : Field{
	var fields = data.getFields("Ship");
	for (var field : Field in fields){
		if (field.getField("blueprintID").getInt() == id){
			return field;
		}
	}
	return null;
}