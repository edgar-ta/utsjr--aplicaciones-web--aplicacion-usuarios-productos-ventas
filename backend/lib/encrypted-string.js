const crypto = require("crypto");

class EncryptedString {
    /** @type {string?} */
    #rawString;

    /** @type {string} */
    #encryptedString;

    /** @type {string} */
    #salt;

    /**
     * 
     * @param {string?} rawString 
     * @param {string} encryptedString 
     * @param {string} salt 
     */
    constructor(rawString, encryptedString, salt) {
        this.#rawString = rawString;
        this.#encryptedString = encryptedString;
        this.#salt = salt;
    }

    get salt() {
        return this.#salt;
    }

    get encryptedString() {
        return this.#encryptedString;
    }

    /**
     * 
     * @param {string} string 
     * @returns {EncryptedString}
     */
    static buildFromSource(string) {
        const salt = crypto.randomBytes(32).toString("hex");
        const hash = crypto.scryptSync(string, salt, 50, 64, "sha512").toString("hex");

        return new EncryptedString(string, hash, salt);
    }

    static encrypt(string, salt) {
        return crypto.scryptSync(string, salt, 50, 64, "sha512").toString("hex");
    }

    /**
     * 
     * @param {string} salt 
     * @param {string} hash 
     * @returns {EncryptedString}
     */
    static buildFromEncryption(salt, hash) {
        return new EncryptedString(null, hash, salt);
    }

    /**
     * 
     * @param {string} string 
     * @returns {boolean}
     */
    isEqualToString(string) {
        if (this.#rawString !== null) return this.#rawString === string;
        return EncryptedString.encrypt(string, this.#salt) == this.#encryptedString;
    }
};

module.exports = EncryptedString;

