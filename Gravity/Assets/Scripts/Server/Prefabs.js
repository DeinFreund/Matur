#pragma strict

var shipPrefabs : Transform[];
var partPrefabs : Transform[];
var guiSkinLocal : GUISkin;
var localRadarGuiTexture : Transform;

static var guiSkin : GUISkin;
static var radarGuiTexture : Transform;

function Awake () {
	Ship.shipPrefabs = shipPrefabs;
	PartManager.componentPrefabs = partPrefabs;
	guiSkin = guiSkinLocal;
	radarGuiTexture = localRadarGuiTexture;
}

static function getGUISkin() : GUISkin{

	return guiSkin;
}

static function getRadarGuiTexture() : Transform{
	return radarGuiTexture;
}