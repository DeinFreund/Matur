#pragma strict

static var spawns :List.<Transform> = new List.<Transform>();

static var index : int = 0;

function Start () {
	spawns.Add(transform);
}


static function getSpawn() : Transform{
	index++;
	index= index%spawns.Count;
	return spawns[index];
}