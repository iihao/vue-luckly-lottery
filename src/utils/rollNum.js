// 和上边的方法一样只是内部有一点一样
export const rollNum = (minValue, maxValue) => {
	const choices = maxValue - minValue + 1 
	return Math.floor(Math.random() * choices + minValue) 
}
