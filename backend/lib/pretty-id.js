/**
 * @typedef {{ id: string, name: string }} PrettyId
 */

/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @returns {PrettyId}
 */
function buildPrettyId(id, name) {
    return {
        id, name
    };
}

/**
 * 
 * @param {{ id: string, name: string }} param0 
 * @returns {PrettyId}
 */
function buildPrettyIdFromObject({ id, name }) {
    return { id, name };
}

module.exports = {
    buildPrettyId,
    buildPrettyIdFromObject
};
