
local target = -1

function objectEnteredRadar(objectID)

	print(objectID .. " entered radar")
	if (target < 0) then
		target = objectID
	end
end

function update(n)

	if target >= 0 then
		dir = getObjectDirection(target)
				
		setSAS((dir),1)
		setEngine("",0.1)
	end
end

setEngine("",0.0)
