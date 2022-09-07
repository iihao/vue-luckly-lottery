/**
 * 定时器
 * @param {*} func
 * @param {number}   delay     [间隔时间，默认 300ms]
 * @param {number}   timeout   [循环时长，默认 1000ms]
 * @returns {promise<number>}     timestamp  [结束时间戳]
 */
const setTimeLinear = (func, options = {}) =>
	new Promise((resolve, reject) => {
		try {
			const { delay = 300, timeout = 10000 } = options
			const startTime = performance.now()
			let endDelay = performance.now()
			const setup = (endTime) => {
				cancelAnimationFrame(requestID)
				if (endTime - startTime <= timeout) {
					if (endTime - endDelay >= delay) {
						func(Date.now())
						endDelay = endTime
					}
					requestID = requestAnimationFrame(setup)
				} else {
					resolve(Date.now())
				}
			}
			let requestID = requestAnimationFrame(setup)
		} catch (error) {
			reject(error)
		}
	})
/**
 * 缓冲定时器
 * @param  {function} func       [回调方法]
 * @param  {number}   timeout    [循环时长，默认 10000ms]
 * @param  {number}   startSpeed [开始速度，默认 100ms]
 * @param  {number}   endSpeed   [结束速度，默认 1000ms]
 * @return {promise<number>}     timestamp  [结束时间戳]
 */
const setTimeEaseOut = async (func, options = {}) => {
	let { timeout = 10000, startSpeed = 100, endSpeed = 1000 } = options
	const startTime = Date.now()
	let stageTime = Date.now()
	return await setTimeLinear(
		(endTime) => {
			if (endTime - stageTime >= startSpeed) {
				func(endTime)
				startSpeed = ((endTime - startTime) / timeout) * endSpeed
				stageTime = endTime
			}
		},
		{
			timeout,
			delay: 0
		}
	)
}

export default setTimeEaseOut
