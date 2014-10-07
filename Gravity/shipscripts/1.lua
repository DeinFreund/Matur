local targetRotAxis = {0.0,-1.0,0.0}
local targetRotAngle = 0.0;
local targetRot = {90.0,0.0,0.0}

function resetSAS()
	targetRotAxis = rotationAxis
	targetRotAngle = rotationAngle
end

local lastAngle1 = 0.0
local lastV1 = 1.0
local lastAngle2 = 0.0
local rotAccel = 0.9
local rotSpeed = {0.0,0.0,0.0}
local lastRotPos = {0.0,0.0,0.0}
local deltaTime = 0.2;



function updateSAS()
	maxAccel = rotAccel / 1.732
	amt = {-0.05,0.0,0.0}
	for axis=1,1 do
		rotation[axis] = normAng(rotation[axis])
		rotSpeed[axis] = (rotation[axis] - lastRotPos[axis]) / deltaTime
		lastRotPos[axis] = rotation[axis]
		--ignoring 180° stutter for now
		--assuming it is possible to brake in time
		
		--could be division by zero
		etatarget = abs(rotation[axis]/(0.5*rotSpeed[axis]))
		etastop = abs(rotSpeed[axis]/maxAccel)
		print ("eta target: " .. etatarget)
		print ("eta stop: " .. etastop)
		print ("current rot: " .. rotation[axis])
		print ("target rot: " .. targetRot[axis])
		print ("rot speed: " .. rotSpeed[axis])
		print ("diff: " .. angDiff(targetRot[axis],rotation[axis]))
		if (etatarget>=etastop) then
			amt[axis] = amt[axis] * -1
		end
		if (angDiff(targetRot[axis],rotation[axis]) > 180) then
			amt[axis] = amt[axis] * -1
		end
		
	end
	setTorque(1.0,amt)
end

function updateSAS3()
	
	--printVector(targetRotAxis)
	--printVector(rotationAxis)
	--print("z " .. rotationAngle .. " ztarget " .. targetRotAngle)
	axis1 = cross(targetRotAxis,rotationAxis)
	x = mag(axis1) / math.max(0.01, mag(targetRotAxis)) / math.max(0.01,mag(rotationAxis))
	angle1 = math.asin(x) * 180.0 / math.pi-- winkel aktuelle axis zu targetAxis
	--p1 = angle1 / 180.0;
	v1 = (lastAngle1 - angle1) /  deltaTime
	
	if (angle1/(0.5*v1+0.01)>=v1/rotAccel) then
		amt1 = -1
	else
		amt1 = 1
	end
	print(angle1 .. " / " ..(0.5*v1+0.01) .. ">=" .. v1 .. " / " .. rotAccel)
	print(angle1/(0.5*v1+0.01).. ">=" .. v1/rotAccel)
	--print("prop" .. -1*p1 .. " diff: " .. 0.1*d1 .. " = " .. amt1)
	axis2 = rotationAxis
	angle2 = (mod(targetRotAngle - rotationAngle + 180.0, 360.0) - 180.0) --winkel aktuell angle zu targetangle
	p2 = angle2 / 180.0 --range (-180.0 - +180.0) / 180
	d2 = lastAngle2 - angle2
	amt2 = 0--1*p2 - 0.3*d2
	
	--print("angle to target: ".. angle1 .. "|" .. angle2 .. " -> " .. p2 )
	amt, axis= addAngleAxis(amt1,axis1,amt2,axis2)
	--if (math.abs(p2) > math.abs(p1)) then
		--amt = amt2
		--axis = axis2
	--else
		--amt = amt1
		--axis = axis1
	--end
	--amt = amt2
	--axis = axis2
	--printVector(axis)
	setTorque(math.max(-1.0,math.min(1.0,amt)),axis)
	lastAngle1 = angle1
	lastAngle2 = angle2
end

local lastTime = 0.0

local radarObjects = {}

function objectEnteredRadar(objectID)
	print(objectID .. " entered radar")
	dir = getObjectDirection(objectID)
		
	setSAS(dir,1)
	radarObjects[objectID] = true
	setTarget(objectID)
end

function objectExitedRadar(objectID)
	radarObjects[objectID] = false
end

function getClosestObject()
	bestDist = -1
	bestID = -1
	for k,v in ipairs(radarObjects) do
		
		if v and (bestDist < 0 or getObjectDistance(k) < bestDist) then
			bestDist = getObjectDistance(k)
			bestID = k
		end
	end
	return bestID
end

function test()
	print("test successful")
end

local lastShot = 0

function update(n)
	deltaTime = time - lastTime
	lastTime = time
	
	if time - lastShot > 1.5 then
		fire("Cannon")
		lastShot = time
	end
	if not targetRotAxis  then
		--resetSAS()
	end
	--rotation = {5}
	--updateSAS()
	--print(rotation[1]  .. " at " .. time)
	--print(time  .. " 1")
end
time = 0
--rotationAxis = {0,0,0}
print("hi\n")

setEngine("blub",0.0)
