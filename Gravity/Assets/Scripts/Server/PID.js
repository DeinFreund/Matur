#pragma strict

class PID3D{

	var i : Vector3 = Vector3.zero;
	var oldErr : Vector3 = Vector3.zero;
	
	var mp : float;
	var mi : float;
	var md : float;

	public function PID3D(p : float, i : float, d : float){
		mp = p; mi = i; md = d;
	}
	
	public function getCorrection(error : Vector3, deltaTime : float) : Vector3{
		i += error * deltaTime;
		var ret = mp*error + mi * i + md * (error - oldErr) / deltaTime;
		oldErr = error;
		//Debug.Log(error + " -> " + ret);
		return ret;
	}
}

class PID{

	var i : float = 0;
	var oldErr : float = 0;
	
	var mp : float;
	var mi : float;
	var md : float;

	public function PID(p : float, i : float, d : float){
		mp = p; mi = i; md = d;
	}
	
	public function getCorrection(error : float, deltaTime : float) : float{
		i += error * deltaTime;
		var ret = mp*error + mi * i + md * (error - oldErr) / deltaTime;
		oldErr = error;
		//Debug.Log(mp + ", " + mi + ", " + md);
		//Debug.Log(error + " -> " + ret);
		return ret;
	}
}