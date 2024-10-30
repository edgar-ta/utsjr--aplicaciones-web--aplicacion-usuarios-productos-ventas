const Controller = require("./controller");
const EncryptedString = require("../lib/encrypted-string.js");
const Validator = require("../lib/validator");
const ProductConnection = require("./connection.js").products;
const Result = require("../lib/result.js");

/**
 * @typedef {string} Name
 * 
 * @typedef {{ name: Name, price: number, stock: number }} ProductController_Input
 * @typedef {{ name: Name, price: number, stock: number }} ProductController_Internal_Incomplete
 * @typedef {{ name: Name, price: number, stock: number }} ProductController_Payload
 * @typedef {{ name: Name, price: number, stock: number, id: string, totalValue: number }} ProductController_Data
 */

/**
 * @typedef {ProductController_Internal_Incomplete & { id: string }} ProductController_Internal_Complete
 */

/**
 * @extends {Controller<ProductController_Input, ProductController_Internal_Incomplete, ProductController_Payload, ProductController_Data>}
 */
class ProductController extends Controller {
    static INSTANCE = new ProductController();

    static PRODUCT_SCHEMA = {
        name: new Validator()
            .required("El nombre debe estar presente")
            .maxLength(32, "El nombre debe tener una longitud de máximo 32 caracteres")
            .minLength(8, "El nombre debe tener mínimo 8 caracteres de longitud")
            .titleCase("El nombre debe estar capitalizado como título"),
        price: new Validator()
            .required("El precio debe estar presente")
            .isNumber("El precio debe ser un número")
            .isGreaterThanZero("El precio debe ser mayor a cero"),
        stock: new Validator()
            .required("El precio debe estar presente")
            .isNumber("El precio debe ser un número")
            .isGreaterThanZero("El precio debe ser mayor a cero")
    };

    get instance() {
        return ProductController.INSTANCE;
    }

    get connection() {
        return ProductConnection;
    }

    /**
     * 
     * @param {ProductController_Input} record 
     * @returns {Promise<Result<string, ProductController_Internal_Incomplete>>}
     */
    async buildFromInput(record) {
        return Validator
            .validateObject(record, ProductController.PRODUCT_SCHEMA)
            .map((value) => ({
                name: record.name,
                price: record.price,
                stock: record.stock,
            }))
        ;
    }


    /**
     * 
     * @param {ProductController_Payload} record 
     * @param {string} id 
     * @returns {Promise<Result<string, ProductController_Internal_Complete>>}
     */
    async buildFromPayload(record, id) {
        return Validator
            .validateObject(record, ProductController.PRODUCT_SCHEMA)
            .map(value => ({
                id,
                name: record.name,
                price: Number.parseFloat(record.price),
                stock: Number.parseFloat(record.stock),
            }))
        ;
    }

    /**
     * 
     * @param {ProductController_Internal_Incomplete | ProductController_Internal_Complete} record 
     * @returns {ProductController_Payload}
     */
    convertToPayload(record) {
        return {
            name: record.name,
            price: record.price,
            stock: record.stock,
        };
    }

    /**
     * 
     * @param {ProductController_Internal_Complete} record 
     * @returns {Promise<ProductController_Data>}
     */
    async convertToData(record) {
        return {
            id: record.id,
            name: record.name,
            price: record.price,
            stock: record.stock,
            totalValue: record.stock * record.price
        };
    }
}

module.exports = ProductController.INSTANCE;
