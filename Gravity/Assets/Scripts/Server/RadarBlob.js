#pragma strict

private var emission : float = 1f;
private var id : int;

private static var idCounter : int = 0;
private static var blobs : List.<RadarBlob> = new List.<RadarBlob>();

static function getBlob(id : int){
	if (id >= blobs.Count || id < 0) return null;
	return blobs[id];
}

function Start () {
	Radar.addBlob(this);	
	blobs.Add(this);
	id = idCounter;
	idCounter ++;
	
}

function getEmission() : float{
	return emission;
}


function setBlobEmission(val : float){

	networkView.RPC("setEmission", RPCMode.Others , val);
	emission = val;
}

function getId() : int{
	return id;
}