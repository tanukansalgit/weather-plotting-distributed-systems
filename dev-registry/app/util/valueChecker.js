/**
 * Check String value
 * @param {String} value - String value
 * @param {String} defaultValue - Default value
 */
function checkStringValue(value, defaultValue){
    return value === undefined ? (defaultValue || value) : String(value);
}

/**
 * Check Number value
 * @param {Number} value - Number value
 * @param {Number} defaultValue - Default value
 */
function checkNumberValue(value, defaultValue){
    return isNaN(value) ? (defaultValue || value) : Number(value);
}

/**
 * Check Array value
 * @param {String} value - String value 
 * @param {Array} defaultValue - Default value
 */
function checkArrayValue(value, defaultValue){
    if(value && !Array.isArray(value))
        value = [value];
    else if(!value && defaultValue)
        value = defaultValue;
    return value;
}

/**
 * Check Boolean value
 * @param {Boolean} value - Boolean value 
 * @param {Boolean} defaultValue - Default value
 */
function checkBooleanValue(value, defaultValue){
    if(typeof value === "boolean"){
        return value;
    }else if(typeof value === "string")
        value = value.trim() === "true" ? true : false;
    else if(typeof value === "number"){
        value = value === 0 ? false : true;
    }else if(typeof defaultValue != "undefined"){
        value = defaultValue;
    }
    return value;
}


module.exports = {
    checkArrayValue,
    checkBooleanValue,
    checkNumberValue,
    checkStringValue
};