
export const rollNum = (minValue, maxValue) => {
	const choices = maxValue - minValue + 1 
	return Math.floor(Math.random() * choices + minValue) 
}
