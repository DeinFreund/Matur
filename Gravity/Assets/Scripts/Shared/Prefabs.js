#pragma strict

var shipPrefabs : Transform[];
var partPrefabs : Transform[];
var guiSkinLocal : GUISkin;

static var guiSkin : GUISkin;

function Start () {
	Ship.shipPrefabs = shipPrefabs;
	PartManager.componentPrefabs = partPrefabs;
	guiSkin = guiSkinLocal;
}

static function getGUISkin() : GUISkin{

	return guiSkin;
}