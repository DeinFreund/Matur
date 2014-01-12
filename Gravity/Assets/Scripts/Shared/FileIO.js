#pragma strict

import System.IO;
import System.Collections.Generic;


static function AttachFile(path : String, data : String[])
{

    var org:String[] = ReadFile(path);
    var res:String[] = new String[org.length + data.length];
    for (var i : int = 0 ; i < org.length; i++){
    	res[i] = org[i];
    }
    for (i = org.length; i < res.length; i++){
    	res[i] = data[i - org.length];
    }
    WriteFile(path,res);
}

static function WriteFile(path : String, data : String[])
{

    var sw : StreamWriter = new StreamWriter(path);

	for (var i:int = 0; i < data.Length; i++){
		sw.WriteLine(data[i]);
	}

    sw.Flush();
    sw.Close();
}

static function ReadFile(path : String): String[] {

	if (!System.IO.File.Exists(path)) return new String[0];
	
    var sr: StreamReader = new StreamReader(path);
 	var data: List.<String>  = new List.<String>();
    var input:String = "";
	
    while (! sr.EndOfStream) {
        data.Add(sr.ReadLine());
        if (input == null) break;
    }

    sr.Close();
	return data.ToArray();
}

static function DeleteFile(path : String){
	
	if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
}

static function getVector(data : String[], startindex:int) : Vector3{
	if (data.length < startindex + 3)	return Vector3.zero;
	var val:Vector3 = new Vector3();
	val.x = parseFloat(data[startindex]);
	val.y = parseFloat(data[startindex+1]);	
	val.z = parseFloat(data[startindex+2]);
	return val;
}

static function getQuaternion(data : String[], startindex:int) : Quaternion{
	if (data.length < startindex + 4)	return new Quaternion();
	var val:Quaternion = new Quaternion();
	val.x = parseFloat(data[startindex]);
	val.y = parseFloat(data[startindex+1]);	
	val.z = parseFloat(data[startindex+2]);	
	val.w = parseFloat(data[startindex+3]);
	return val;
}

static function setVector(data : String[], startindex:int, val:Vector3){
	if (data.length < startindex + 3)	Debug.LogError("Not enough space in array to store Vector3");
	data[startindex] = val.x.ToString();
	data[startindex+1] = val.y.ToString();
	data[startindex+2] = val.z.ToString();
}

static function setQuaternion(data : String[], startindex:int, val:Quaternion){
	if (data.length < startindex + 4)	Debug.LogError("Not enough space in array to store Quaternion");
	data[startindex] = val.x.ToString();
	data[startindex+1] = val.y.ToString();
	data[startindex+2] = val.z.ToString();
	data[startindex+3] = val.w.ToString();
}

function Test(){
	
	
	var data:String[] = new String[3];
	data[0] = "test";
	data[1] = "hallo";
	data[2] = "bb";
	WriteFile("test.txt",data);
	Debug.Log(ReadFile("test.txt")[2]);
}