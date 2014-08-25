#pragma strict

interface IPart
{


	function getType():int;
	
	function getName():String;
	
	function LoadPart(Field : Field):void;
}
