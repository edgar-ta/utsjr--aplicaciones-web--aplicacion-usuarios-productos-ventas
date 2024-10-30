const UserController = require("./user.js");
const ProductController = require("./product.js");
const Result = require("../lib/result.js");
const DateControlObject = require("../lib/date-control-object.js");
const PrettyId = require("../lib/pretty-id.js");

const Controller = require("./controller.js");
const Validator = require("../lib/validator");
const Optional = require("../lib/optional.js");
const SalesConnection = require("./connection.js").sales;

/**
 * @typedef {"canceled" | "active" | "pending"} SaleState
 */

/**
 * @typedef {import("firebase-admin").firestore.Timestamp} FirestoreTimestamp
 */

/**
 * @typedef {{ user: string, product: string, amountOfProduct: number }} SaleController_Input
 * @typedef {{ user: string, product: string, amountOfProduct: number, date: Date, state: SaleState }} SaleController_Internal_Incomplete
 * @typedef {{ user: string, product: string, amountOfProduct: number, date: Date | FirestoreTimestamp, state: SaleState }} SaleController_Payload
 * @typedef {{ user: PrettyId.PrettyId, product: PrettyId.PrettyId, amountOfProduct: number, purchaseTime: DateControlObject.DateControlObject, state: SaleState, amountOfSale: number }} SaleController_Data
 */

/**
 * @typedef {SaleController_Internal_Incomplete & { id: string }} SaleController_Internal_Complete
 */

/**
 * @extends {Controller<SaleController_Input, SaleController_Internal_Incomplete, SaleController_Payload, SaleController_Data>}
 */
class SaleController extends Controller {
    static INSTANCE = new SaleController();

    static SALE_SCHEMA = {
        user: new Validator()
            .required("La id del usuario debe estar presente"),
        product: new Validator()
            .required("La id del producto debe estar presente"),
        amountOfProduct: new Validator()
            .required("La cantidad de producto debe estar presente")
            .isNumber("La cantidad de producto debe ser un número")
            .isGreaterThanZero("La cantidad de producto debe ser mayor a cero")
    };

    get instance() {
        return SaleController.INSTANCE;
    }

    get connection() {
        return SalesConnection;
    }

    /**
     * 
     * @param {string} user 
     * @param {string} product 
     * @returns {Promise<[ import("./user.js").UserController_Internal_Complete, import("./product.js").ProductController_Internal_Complete ]>}
     */
    async validateUserAndProductExist(user, product) {
        return Promise.all([
            UserController
                .find(user)
                .then(optional => optional.isSome()? Promise.resolve(optional.unwrap()): Promise.reject("El usuario especificado no existe"))
                ,
            ProductController
                .find(product)
                .then(optional => optional.isSome()? Promise.resolve(optional.unwrap()): Promise.reject("El producto especificado no existe")),
        ])
        ;
    }

    /**
     * 
     * @param {SaleController_Input} record 
     * @returns {Promise<Result<string, SaleController_Internal_Incomplete>>}
     */
    async buildFromInput(record) {
        return Validator
            .validateObject(record, SaleController.SALE_SCHEMA)
            .asyncMap(async (value) => this.validateUserAndProductExist(record.user, record.product).then(([ _, product ]) => {
                const saleDate = new Date();
        
                /** @type {SaleState} */
                const saleState = "active";

                if (record.amountOfProduct > product.stock) {
                    return Promise.reject("La cantidad de producto de la venta es mayor a la cantidad de producto en existencia");
                }

                return {
                    user: record.user,
                    product: record.product,
                    amountOfProduct: record.amountOfProduct,
                    date: saleDate,
                    state: saleState
                };
            }))
        ;
    }

    /**
     * 
     * @param {SaleController_Payload} record 
     * @param {string} id 
     * @returns {Promise<Result<string, SaleController_Internal_Complete>>}
     */
    async buildFromPayload(record, id) {
        return Validator
            .validateObject(record, SaleController.SALE_SCHEMA)
            .asyncMap(async (value) => this.validateUserAndProductExist(record.user, record.product).then(() => {
                /** @type {Date} */
                let date;
                if (!(record.date instanceof Date)) {
                    date = record.date.toDate();
                } else {
                    date = record.date;
                }

                return {
                    id,
                    amountOfProduct: Number.parseInt(record.amountOfProduct),
                    date,
                    product: record.product,
                    state: record.state,
                    user: record.user
                }
            }))
        ;
    }

    /**
     * 
     * @param {SaleController_Internal_Incomplete | SaleController_Internal_Complete} record 
     * @returns {SaleController_Payload}
     */
    convertToPayload(record) {
        return {
            amountOfProduct: record.amountOfProduct,
            date: record.date,
            product: record.product,
            state: record.state,
            user: record.user
        };
    }

    /**
     * 
     * @param {SaleController_Internal_Complete} record 
     * @returns {Promise<SaleController_Data>}
     */
    async convertToData(record) {
        return this.validateUserAndProductExist(record.user, record.product)
            .then(([ user, product ]) => {
                return {
                    id: record.id,
                    amountOfProduct: record.amountOfProduct,
                    amountOfSale: record.amountOfProduct * product.price,
                    purchaseTime: DateControlObject.buildDateControlObject(record.date),
                    state: record.state,
                    user: PrettyId.buildPrettyId(user.id, user.name),
                    product: PrettyId.buildPrettyId(product.id, product.name)
                };
            });
    };

    /**
     * 
     * @param {SaleController_Internal_Incomplete} record 
     * @returns {Promise<string>}
     */
    async insert(record) {
        return ProductController
            .find(record.product)
            .then((optionalProduct) => {
                if (optionalProduct.isEmpty()) {
                    return Promise.reject("El producto especificado ya no existe");
                }
                const product = optionalProduct.unwrap();
                const newStock = product.stock - record.amountOfProduct;
                if (newStock < 0) {
                    return Promise.reject("Ya no hay cantidad suficiente del producto especificado");
                }

                return ProductController.connection.doc(record.product)
                    .update({ stock: newStock });
            })
            .then(() => super.insert(record))
        ;
    }

    /**
     * @param {string} id 
     * @returns {Promise<Optional<string>>}
     */
    async delete(id) {
        /** @type {SaleState} */
        const state = "canceled";

        return this
            .find(id)
            .then(optionalSale => {
                if (optionalSale.isEmpty()) {
                    return Promise.reject("La venta especificada ya no existe");
                }
                /** @type {SaleController_Internal_Complete} */
                const sale = optionalSale.unwrap();
                if (sale.state == "canceled") {
                    return Promise.reject("La venta especificada ya fue cancelada anteriormente");
                }

                return Promise.all([sale, ProductController.find(sale.product)]);
            })
            .then(([ sale, optionalProduct ]) => {
                if (optionalProduct.isEmpty()) {
                    return Promise.reject("El producto especificado ya no existe");
                }
                const product = optionalProduct.unwrap();
                const newStock = product.stock + sale.amountOfProduct;

                return ProductController.connection.doc(product.id)
                    .update({ stock: newStock })
            })
            .then(() => this.connection.doc(id).update({ state }))
            .then(() => Optional.some("La venta fue cancelada exitosamente"))
        ;
    }

    async editByIdRouterCallback(request, response) {
        const body = request.body;
        const id = request.params.id;
        if (id === undefined || id === null || id === "") {
            return Controller.RESPONSE_TYPE.NO_ID_GIVEN(response);
        }

        await Validator
            .validateObject(body, SaleController.SALE_SCHEMA)
            .asyncMap(async (value) => this
                .validateUserAndProductExist(body.user, body.product)
                .then(async (_) => {
                    const { user, product, amountOfProduct } = body;
                    const payload = { user, product, amountOfProduct };

                    return this
                        .find(id)
                        .then(optionalRecord => {
                            return optionalRecord.asyncMap(async (record) => {
                                return this.connection
                                    .doc(id)
                                    .update(payload)
                                    .then(() => "El registro se actualizó correctamente")
                            })
                        })
                        .then(result => {
                            console.debug(result);
                            if (result.isEmpty()) {
                                return Controller.RESPONSE_TYPE.NOT_FOUND(response);
                            } else {
                                return Controller.RESPONSE_TYPE.SUCCESS(response)(result.unwrap());
                            }
                        })
                    ;
                })
                .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        );
    }
}

module.exports = SaleController.INSTANCE;
