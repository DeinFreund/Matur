#pragma strict

class MinimalUser
{
	public var client : NetworkPlayer;
	public var name : String;
	
	function MinimalUser(client : NetworkPlayer, username : String){
		this.client = client;
		this.name = username;
	}
}