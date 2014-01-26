#pragma strict

var shipPrefabs : Transform[];
var partPrefabs : Transform[];

function Start () {
	Ship.shipPrefabs = shipPrefabs;
	PartManager.componentPrefabs = partPrefabs;
}
