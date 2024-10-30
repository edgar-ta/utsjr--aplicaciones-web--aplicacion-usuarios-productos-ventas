const Result = require("./result.js");

class Validator {
    /**
     * @typedef {(input: string) => Result<string, boolean>} Constraint
     */

    /** @type {Constraint[]} */
    #constraints;

    /**
     * 
     * 
     */
    constructor() {
        this.#constraints = [];
    }

    /**
     * 
     * @param {(input: string) => boolean} predicate 
     * @param {string} message 
     * @returns {Validator}
     */
    addConstraint(predicate, message) {
        this.#constraints.push((input) => {
            const isOk = predicate(input);
            if (isOk) return Result.ok(true);
            return Result.error(message);
        });
        return this;
    }

    /**
     * 
     * @param {string} input 
     * @returns {Result<string, boolean>}
     */
    validate(input) {
        for (const constraint of this.#constraints) {
            const result = constraint(input);
            if (result.isError()) return result;
        }
        return Result.ok(true);
    }

    /**
     * @template K
     * @param {K} object 
     * @param {{ [key in keyof K]: Validator }} validationObject 
     * @returns {Result<string, boolean>}
     */
    static validateObject(object, validationObject) {
        for (const [ key, validator ] of Object.entries(validationObject)) {
            const value = object[key];
            const result = validator.validate(value);

            if (result.isError()) return result;
        }
        return Result.ok(true);
    }

    /**
     * 
     * @param {number} length 
     * @param {string} message 
     * @returns {Validator}
     */
    minLength(length, message) {
        return this.addConstraint((input) => input.length >= length, message);
    }

    /**
     * 
     * @param {number} length 
     * @param {string} message 
     * @returns {Validator}
     */
    maxLength(length, message) {
        return this.addConstraint((input) => input.length <= length, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    required(message) {
        return this.addConstraint((input) => input !== undefined && input !== null && input !== "", message);
    }

    /**
     * 
     * @param {RegExp} pattern 
     * @param {string} message 
     * @returns {Validator}
     */
    pattern(pattern, message) {
        return this.addConstraint((input) => pattern.test(input), message);
    }

    /**
     * Checks that the existing words of the message are capitalized; notice
     * that a succesful check doesn't imply that the message is composed of 
     * capitalized words only
     * @param {string} message 
     * @returns {Validator}
     */
    titleCase(message) {
        // return this.pattern(/^[A-ZÁÉÍÓÚÜ][a-záéíóúü]+( [A-ZÁÉÍÓÚÜ][a-záéíóúü]+)*$/, message);
        return this.pattern(/^[A-ZÁÉÍÓÚÜ][a-záéíóúü]+(\s[^a-záéíóúü][^\s]+)*$/, message);
    }
    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    onlyAlphabetics(message) {
        return this.pattern(/^[a-zA-Z_]*$/, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    hasUppercase(message) {
        return this.pattern(/[A-Z]/, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    hasLowercase(message) {
        return this.pattern(/[a-z]/, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    hasDigits(message) {
        return this.pattern(/[0-9]/, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {Validator}
     */
    isNumber(message) {
        return this.addConstraint((input) => {
            const number = Number.parseFloat(input);
            if (Number.isNaN(number)) return false;
            return true;
        }, message);
    }
    
    isGreaterThanZero(message) {
        return this.addConstraint((input) => {
            const number = Number.parseFloat(input);
            if (Number.isNaN(number)) return false;
            return number > 0;
        }, message);

    }
};

module.exports = Validator;

