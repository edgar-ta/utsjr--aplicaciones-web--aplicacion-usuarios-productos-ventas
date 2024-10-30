/**
 * @template Value
 */
class Optional {
    /** @type {Value?} */
    #value;

    /**
     * 
     * @param {Value?} value 
     */
    constructor(value) {
        this.#value = value;
    }

    /**
     * @template Value
     * @param {Value} value 
     * @returns {Optional<Value>}
     */
    static some(value) {
        return new Optional(value);
    }

    /**
     * @returns {Optional<null>}
     */
    static empty() {
        return new Optional(null);
    }

    /**
     * 
     * @returns {boolean}
     */
    isEmpty() {
        return this.#value === null;
    }

    /**
     * 
     * @returns {boolean}
     */
    isSome() {
        return this.#value !== null;
    }

    /**
     * 
     * @returns {Value}
     */
    unwrap() {
        return this.#value;
    }

    /**
     * @template K
     * @param {(value: Value) => K} callback 
     * @returns {Optional<K>}
     */
    map(callback) {
        if (this.isSome()) {
            const newValue = callback(this.#value);
            return Optional.some(newValue);
        }
        return this;
    }

    /**
     * @template K
     * @param {async (value: Value) => Promise<K>} callback 
     * @returns {Optional<K>}
     */
    async asyncMap(callback) {
        if (this.isSome()) {
            return callback(this.#value)
                .then(value => Optional.some(value))
                ;
        }
        return this;
    }
}

module.exports = Optional;
