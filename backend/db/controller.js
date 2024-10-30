const admin = require("firebase-admin");

const Optional = require("../lib/optional.js");
const Result = require("../lib/result.js");

const PrettyId = require("../lib/pretty-id.js");
const DateControlObject = require("../lib/date-control-object.js");


/**
 * 
 * 
 * @template InputType The collection of data that is entered/given by the user
 * @template InternalType_Incomplete The object that's used internally to handle most operations regarding the 
 * kind of entity of the controller
 * @template PayloadType The data that's retrieved from/stored in the database
 * @template DataType The type that's used to respond with in API calls requesting an entity 
 * (a "display" type)
 */
class Controller {
    /**
     * @typedef {InternalType_Incomplete & { id: string }} InternalType_Complete
     */

    /**
     * 
     * @param {string} type 
     * @returns {(response: Response<any, Record<string, any>, number>) => any => void}
     */
    static buildResponseCallback(type) {
        return function(response) {
            return (details) => response.json({ type, details });
        }
    }

    static RESPONSE_TYPE = {
        SUCCESS:        Controller.buildResponseCallback("Success"),
        BAD_RESPONSE:   Controller.buildResponseCallback("Bad response"),
        NO_ID_GIVEN:    (response) => Controller.buildResponseCallback("Bad url")(response)("La URL debería incluir el parámetro 'id'"),
        NOT_FOUND:      (response) => Controller.buildResponseCallback("Not found")(response)("El registro con la id especificada no existe"),
        WRONG_INPUT:    Controller.buildResponseCallback("Wrong input"),
    };

    /**
     * @returns {admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>}
     */
    get connection() {};

    /**
     * @returns {Controller<InputType, InternalType_Incomplete, PayloadType, DataType>}
     */
    get instance() {};

    /**
     * Converts data inputted by the user in a functional/useful object within
     * the internal context of the application
     * @param {InputType} record 
     * @returns {Promise<Result<string, InternalType_Incomplete>>}
     */
    async buildFromInput(record) {}

    /**
     * 
     * @param {PayloadType} record 
     * @param {string} id 
     * @returns {Promise<Result<string, InternalType_Complete>>}
     */
    async buildFromPayload(record, id) {};

    /**
     * 
     * @param {InternalType_Incomplete | InternalType_Complete} record 
     * @returns {PayloadType}
     */
    convertToPayload(record) {};

    /**
     * 
     * @param {InternalType_Complete} record 
     * @returns {Promise<DataType>}
     */
    async convertToData(record) {};

    /**
     * Gets all entities in the database
     * 
     * It is important that this method returns an internal object, not a data one,
     * so that it can be used modularly with other parts of the app
     * 
     * @returns {Promise<InternalType_Complete[]>}
     */
    async getAll() {
        return this.connection.get()
            .then(records => {
                const array = [];
                records.forEach(record => array.push(record))
                return array;
            })
            .then(records => Promise.all(records.map(async (record) => {
                const data = record.data();
                const buildResult = await this.buildFromPayload(data, record.id);

                return buildResult;
            })))
            .then(results => {
                results.forEach(result => {
                    if (result.isError()) {
                        const error = result.getLeft();

                        console.debug("One of the records is invalid");
                        console.debug(error);
                    }
                })
                return results
                    .filter(result => result.isOk())
                    .map(result => result.getRight());
            })
        ;
    };

    /**
     * 
     * @param {InternalType_Incomplete} record 
     * @returns {Promise<string>}
     */
    async insert(record) {
        const uploadRecord = this.convertToPayload(record);

        return this.connection
            .add(uploadRecord)
            .then(() => "El registro se insertó de manera exitosa");
    };


    /**
     * Finds an entity with the given id.
     * 
     * It is important that this method returns an internal object, not a data one,
     * so that it can be used modularly with other parts of the app
     * @param {string} id 
     * @returns {Promise<Optional<InternalType_Complete>>}
     */
    async find(id) {
        return this.connection.doc(id).get()
            .then((record) => this.buildFromPayload(record.data() || {}, record.id))
            .then(result => result.isError()? Optional.empty(): Optional.some(result.getRight()))
    }


    /**
     * 
     * @param {string} id 
     * @returns {Promise<Optional<string>>}
     */
    async delete(id) {
        return this
            .find(id)
            .then((optionalRecord) => {
                return optionalRecord.asyncMap(async (record) => {
                    return this.connection.doc(record.id).delete({ exists: true })
                        .then(() => "El registro se eliminó de manera exitosa")
                    ;
                });
            })
        ;
    };

    /**
     * 
     * @param {string} id 
     * @param {InternalType_Incomplete} payload 
     * @returns {Promise<Optional<string>>}
     */
    async update(id, payload) {
        const uploadRecord = this.convertToPayload(payload);

        return this
            .find(id)
            .then(optionalRecord => {
                return optionalRecord.asyncMap(async (record) => {
                    return this.connection
                        .doc(id)
                        .update(uploadRecord)
                        .then(() => "El registro se actualizó correctamente")
                })
            })
        ;
    }

    async getAllRouterCallback(request, response) {
        await this
            .getAll()
            .then(rawRecords => Promise.all(rawRecords.map((value) => this.convertToData(value))))
            .then(records => Controller.RESPONSE_TYPE.SUCCESS(response)(records))
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }

    async postNewRouterCallback(request, response) {
        const body = request.body;

        await this
            .buildFromInput(body)
            .then(result => {
                if (result.isError()) {
                    const message = result.getLeft();
                    return Controller.RESPONSE_TYPE.WRONG_INPUT(response)(message);
                }

                const data = result.getRight();
                return this
                    .insert(data)
                    .then(Controller.RESPONSE_TYPE.SUCCESS(response))
                ;
            })
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }

    async findByIdRouterCallback(request, response) {
        const id = request.params.id;
        if (id === undefined || id === null || id === "") {
            Controller.RESPONSE_TYPE.NO_ID_GIVEN(response);
            return;
        }
    
        await this
            .find(id)
            .then((optionalUser) => {
                if (optionalUser.isEmpty()) {
                    return Controller.RESPONSE_TYPE.NOT_FOUND(response);
                } else {
                    const user = optionalUser.unwrap();
                    return this
                        .convertToData(user)
                        .then(payload => Controller.RESPONSE_TYPE.SUCCESS(response)(payload))
                    ;
                }
            })
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }

    async deleteByIdRouterCallback(request, response) {
        const id = request.params.id;
        if (id === undefined || id === null || id === "") {
            Controller.RESPONSE_TYPE.NO_ID_GIVEN(response);
            return;
        }
        
        await this
            .delete(id)
            .then((optionalString) => {
                if (optionalString.isEmpty()) {
                    return Controller.RESPONSE_TYPE.NOT_FOUND(response);
                } else {
                    return Controller.RESPONSE_TYPE.SUCCESS(response)(optionalString.unwrap());
                }
            })
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }

    async editByIdRouterCallback(request, response) {
        const body = request.body;
        const id = request.params.id;
        if (id === undefined || id === null || id === "") {
            return Controller.RESPONSE_TYPE.NO_ID_GIVEN(response);
        }

        await this
            .buildFromInput(body)
            .then(result => {
                if (result.isError()) {
                    const message = result.getLeft();
                    return Controller.RESPONSE_TYPE.WRONG_INPUT(response)(message);
                }

                const data = result.getRight();

                return this
                    .update(id, data)
                    .then(result => {
                        if (result.isEmpty()) {
                            return Controller.RESPONSE_TYPE.NOT_FOUND(response);
                        } else {
                            return Controller.RESPONSE_TYPE.SUCCESS(response)(result.unwrap());
                        }
                    })
                ;
            })
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }

    get routes() {
        const router = require("express").Router();
        
        router.get("/all",              (request, response) => this.getAllRouterCallback(request, response));
        router.post("/new",             (request, response) => this.postNewRouterCallback(request, response));
        router.get("/find/:id",         (request, response) => this.findByIdRouterCallback(request, response));
        router.delete("/delete/:id",    (request, response) => this.deleteByIdRouterCallback(request, response));
        router.post("/edit/:id",        (request, response) => this.editByIdRouterCallback(request, response));

        return router;
    }
}

module.exports = Controller;
