/**
 * @typedef DateObject
 * @property {number} day Day of the month 
 * @property {number} month Month of the year
 * @property {number} year Year in four digits
 * @property {string} representation Readable representation of the date
 */

/**
 * @typedef TimeObject
 * @property {number} hour
 * @property {number} minute
 * @property {number} second
 * @property {number} millisecond
 * @property {string} representation
 */

/**
 * @typedef FormalDate
 * @property {string} utcRepresentation
 * @property {string} isoRepresentation
 */

/**
 * @typedef {{ formalDate: FormalDate, date: DateObject, time: TimeObject }} DateControlObject
 */


/**
 * 
 * @param {Date} date 
 * @returns {DateObject}
 */
function buildDateObject(date) {
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        dayOfWeek: date.getDay(),
        representation: date.toDateString()
    };
}

/**
 * 
 * @param {Date} date 
 * @returns {TimeObject}
 */
function buildTimeObject(date) {
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        representation: date.toTimeString()
    };
}

/**
 * 
 * @param {Date} date 
 * @returns {FormalDate}
 */
function buildFormalDate(date) {
    return {
        isoRepresentation: date.toISOString(),
        utcRepresentation: date.toUTCString()
    };
}

/**
 * 
 * @param {Date} date 
 * @return {DateControlObject}
 */
function buildDateControlObject(date) {
    return {
        date: buildDateObject(date),
        time: buildTimeObject(date),
        formalDate: buildFormalDate(date)
    };
}

module.exports = {
    buildDateObject,
    buildTimeObject,
    buildFormalDate,
    buildDateControlObject
};
