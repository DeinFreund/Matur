#pragma strict
static final var presetFilepath = "data/presets.dat";

private static var data : Field;

static function BeforeNetworkLoadedLevel() {

	if (Network.isClient){
		return;
	}
	data = Field.newField(FileIO.ReadFile(presetFilepath));
	FileIO.WriteFile(presetFilepath,data.getContent());
	
}


static function getAll(): Field{

	return data;//watch out - this is a reference
}

static function getShip(): Field{

	return data.getField("Ship");//watch out - this is a reference
}
