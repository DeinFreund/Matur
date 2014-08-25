local targetRotAxis = {0.0,1.0,0.0}
local targetRotAngle = 0.0;


function resetSAS()
	targetRotAxis = rotationAxis
	targetRotAngle = rotationAngle
end

local lastAngle1 = 0.0
local lastAngle2 = 0.0

function updateSAS()
	
	--printVector(targetRotAxis)
	--printVector(rotationAxis)
	--print("z " .. rotationAngle .. " ztarget " .. targetRotAngle)
	axis1 = cross(targetRotAxis,rotationAxis)
	x = mag(axis1) / math.max(0.01, mag(targetRotAxis)) / math.max(0.01,mag(rotationAxis))
	angle1 = math.asin(x) * 180.0 / math.pi-- winkel aktuelle axis zu targetAxis
	p1 = angle1 / 180.0;
	d1 = lastAngle1 - angle1
	amt1 = -1*p1 + 0.1*d1
	print("prop" .. -1*p1 .. " diff: " .. 0.1*d1 .. " = " .. amt1)
	axis2 = rotationAxis
	angle2 = (mod(targetRotAngle - rotationAngle + 180.0, 360.0) - 180.0) --winkel aktuell angle zu targetangle
	p2 = angle2 / 180.0 --range (-180.0 - +180.0) / 180
	d2 = lastAngle2 - angle2
	amt2 = 1*p2 - 0.3*d2
	
	print("angle to target: ".. angle1 .. "|" .. angle2 .. " -> " .. p2 )
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

function update(n)
	if not targetRotAxis  then
		resetSAS()
	end
	--rotation = {5}
	--updateSAS()
	--print(rotation[1]  .. " at " .. time)
	--print(time  .. " 1")
end
time = 0
--rotationAxis = {0,0,0}
print("hi\n")
