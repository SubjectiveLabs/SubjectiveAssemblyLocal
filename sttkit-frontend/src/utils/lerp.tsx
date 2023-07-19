const lerp = (start: number, end: number, parameter: number) => start * (1 - parameter) + end * parameter
export default lerp
