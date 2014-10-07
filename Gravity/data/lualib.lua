
function setTorque(amt,arr)
	_torque(amt + 0.0,arr[1] + 0.0,arr[2] + 0.0,arr[3] + 0.0,"ReactionWheel")
	print("hi2")
end

function addAngleAxis(w1, v1, w2, v2)
	_addAngleAxis(w1,v1[1],v1[2],v1[3],w2,v2[1],v2[2],v2[3])
	return _addAngleAxisW , {_addAngleAxisX,_addAngleAxisY,_addAngleAxisZ}
end

function getInverse(q)
	_getInverse(q[1],q[2],q[3],q[4])
	return _getInverseRet
end
function setSAS(q, on)
	_setSAS(q[1],q[2],q[3],on)
end

function getObjectDistance(objID)
	_getObjectDistance(objID)
	return _getObjectDistanceRet
end

--function setSAS(x,y,z,w,on)
--	_setSAS(x,y,z,w,on)
--end

function getObjectDirection(objID)
	_getObjectDirection(objID)
	return _getObjectDirectionRet
end

function mod(a,b)
	return ( (a  % b) + b) % b
end

function mag(v)
	return math.sqrt(v[1]*v[1] + v[2]*v[2] + v[3]*v[3] + 0.0)
end

function normalizeAngle(w)
	return ( (w  % 360.0) + 360.0) % 360.0
end

function cross(v1, v2)

	return {v1[2]*v2[3]-v1[3]*v2[2],v1[3]*v2[1]-v1[1]*v2[3],v1[1]*v2[2]-v1[2]*v2[1]}
end

function printVector(axis)

	print(axis[1] .. "|" .. axis[2] .. "|" .. axis[3])
end

function normAng(a)
	return normalizeAngle(a)
end

function angDiff(a,b)
	--from b to a
	print ("angle " .. a-b)
	return normAng(a-b) 
end

function getUp()
	_getUp()
	return _getUpRet
end
function getRight()
	_getRight()
	return _getRightRet
end

function getForward()
	_getForward()
	return _getForwardRet
end

function addTorque(amt, axis)
	_addTorque(amt,axis[1],axis[2],axis[3])
end

function abs(a)
	if (a > 0) then
		return a
	end
	return a * -1
end