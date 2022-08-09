
/**
 * Get unique code (will be used as a referral code)
 * @returns {string} uniqueCode
 */
exports.getUniqueCode = () => {
	let uniqueCode = '';
	const charCode = ['A', 'B', 'c', 'Z', '5', 'X', 'K', 'd', '9', 'D'];
	const epocStr = (Date.now()).toString();
	for(let idx =0; idx< epocStr.length; idx++) {
		uniqueCode = uniqueCode + charCode[Number(epocStr[idx])];
	}
    console.log(uniqueCode)
	return uniqueCode;
}
