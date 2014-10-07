#pragma strict

var shipPrefabs : Transform[];
var partPrefabs : Transform[];
var asteroidPrefabsLocal : Transform[];
var localMissilePrefabs : Transform[];
var missileExplosionsLocal : Transform[];
var guiSkinLocal : GUISkin;
var localRadarGuiTexture : Transform;
var localRadarGuiSelectedTexture : Transform;
var shipExplosionLocal : Transform;
var planetPrefabLocal : Transform;
var healthbarTextureLocal : Texture;

static var asteroidPrefabs : Transform[];
static var planetPrefab : Transform;
static var missilePrefabs : Transform[];
static var missileExplosions : Transform[];
static var guiSkin : GUISkin;
static var radarGuiTexture : Transform;
static var radarGuiSelectedTexture : Transform;
static var shipExplosion : Transform;
static var healthbarTexture : Texture;

function Awake () {
	Ship.shipPrefabs = shipPrefabs;
	PartManager.componentPrefabs = partPrefabs;
	guiSkin = guiSkinLocal;
	radarGuiTexture = localRadarGuiTexture;
	radarGuiSelectedTexture = localRadarGuiSelectedTexture;
	missilePrefabs = localMissilePrefabs;
	missileExplosions = missileExplosionsLocal;
	shipExplosion = shipExplosionLocal;
	healthbarTexture = healthbarTextureLocal;
	planetPrefab = planetPrefabLocal;
	asteroidPrefabs = asteroidPrefabsLocal;
}

static function getGUISkin() : GUISkin{

	return guiSkin;
}

static function getRadarGuiTexture() : Transform{
	return radarGuiTexture;
}
static function getRadarGuiSelectedTexture() : Transform{
	return radarGuiSelectedTexture;
}
static function getMissilePrefabs() :  Transform[]{
	return missilePrefabs;
}
static function getMissileExplosions() :  Transform[]{
	return missileExplosions;
}
static function getAsteroidPrefabs() :  Transform[]{
	return asteroidPrefabs;
}
static function getShipExplosion() :  Transform{
	return shipExplosion;
}
static function getPlanetPrefab() :  Transform{
	return planetPrefab;
}
static function getHealthbarTexture() :  Texture{
	return healthbarTexture;
}
