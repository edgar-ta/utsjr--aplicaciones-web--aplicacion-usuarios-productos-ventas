const Controller = require("./controller");
const EncryptedString = require("../lib/encrypted-string.js");
const Validator = require("../lib/validator");
const UserConnection = require("./connection.js").users;
const Result = require("../lib/result.js");

/**
 * @typedef {string} Name
 * @typedef {string} Username
 * @typedef {string} Password
 * 
 * @typedef {{ name: Name, username: Username, password: Password }} UserController_Input
 * @typedef {{ name: Name, username: Username, password: EncryptedString }} UserController_Internal_Incomplete
 * @typedef {{ name: Name, username: Username, salt: string, encryptedPassword: string }} UserController_Payload
 * @typedef {{ name: Name, username: Username, salt: string, encryptedPassword: string, id: string, systemId: string }} UserController_Data
 */

/**
 * @typedef {UserController_Internal_Incomplete & { id: string }} UserController_Internal_Complete
 */

/**
 * @extends {Controller<UserController_Input, UserController_Internal_Incomplete, UserController_Payload>}
 */
class UserController extends Controller {
    static INSTANCE = new UserController();

    static USER_SCHEMA__PARTIAL = {
        name: new Validator()
            .required("El nombre debe estar presente")
            .maxLength(32, "El nombre debe tener una longitud de máximo 32 caracteres")
            .minLength(8, "El nombre debe tener mínimo 8 caracteres de longitud")
            .titleCase("El nombre debe estar capitalizado como título"),
        username: new Validator()
            .required("El nombre de usuario debe estar presente")
            .maxLength(32, "El nombre de usuario debe tener una longitud de máximo 32 caracteres")
            .minLength(8, "El nombre de usuario debe tener mínimo 8 caracteres de longitud")
            .onlyAlphabetics("El nombre de usuario solo puede tener caracteres del alfabeto inglés y guiones bajos")
    };

    static USER_SCHEMA__INPUT = (() => {
        return { 
            ...UserController.USER_SCHEMA__PARTIAL,
            password: new Validator()
                .required("La contraseña debe estar presente")
                .maxLength(16, "La contraseña debe tener una longitud de máximo 16 caracteres")
                .minLength(8, "La contraseña debe tener mínimo 8 caracteres de longitud")
                .hasDigits("La contraseña debe tener dígitos")
                .hasLowercase("La contraseña debe tener letras en minúscula")
                .hasUppercase("La contraseña debe tener letras en mayúscula")
        };
    })();

    static USER_SCHEMA__UPLOAD = (() => {
        return { 
            ...UserController.USER_SCHEMA__PARTIAL,
            encryptedPassword: new Validator()
                .required("La contraseña en su forma encriptada debe estar presente"),
            salt: new Validator()
                .required("El parámetro salt de la contraseña encriptada debe estar presente")
        };
    })();

    get instance() {
        return UserController.INSTANCE;
    }

    get connection() {
        return UserConnection;
    }

    /**
     * 
     * @param {UserController_Input} record 
     * @returns {Promise<Result<string, UserController_Internal_Incomplete>>}
     */
    async buildFromInput(record) {
        return Validator
            .validateObject(record, UserController.USER_SCHEMA__INPUT)
            .map((value) => {
                const password = EncryptedString.buildFromSource(record.password);
                
                return {
                    name: record.name,
                    username: record.username,
                    password
                }
            })
        ;
    }


    /**
     * 
     * @param {UserController_Payload} record 
     * @param {string} id 
     * @returns {Promise<Result<string, UserController_Internal_Complete>>}
     */
    async buildFromPayload(record, id) {
        return Validator
            .validateObject(record, UserController.USER_SCHEMA__UPLOAD)
            .map((value) => ({
                name: record.name,
                id,
                username: record.username,
                password: EncryptedString.buildFromEncryption(record.salt, record.encryptedPassword)
            }))
            ;
    }

    /**
     * 
     * @param {UserController_Internal_Incomplete | UserController_Internal_Complete} record 
     * @returns {UserController_Payload}
     */
    convertToPayload(record) {
        return {
            name: record.name,
            encryptedPassword: record.password.encryptedString,
            salt: record.password.salt,
            username: record.username
        };
    }

    /**
     * 
     * @param {UserController_Internal_Complete} record 
     * @returns {Promise<UserController_Data>}
     */
    async convertToData(record) {
        return {
            id: record.id,
            name: record.name,
            encryptedPassword: record.password.encryptedString,
            salt: record.password.salt,
            username: record.username,
            systemId: `${record.username}@${record.id}`
        };
    }

    async editByIdRouterCallback(request, response) {
        const body = request.body;
        const id = request.params.id;
        if (id === undefined || id === null || id === "") {
            return Controller.RESPONSE_TYPE.NO_ID_GIVEN(response);
        }

        await this
            .find(id)
            .then(optionalRecord => {
                if (optionalRecord.isEmpty()) {
                    return Controller.RESPONSE_TYPE.NOT_FOUND(response);
                }

                /** @type {UserController_Internal_Complete} */
                const record = optionalRecord.unwrap();

                /** @type {Result<UserController_Internal_Incomplete>} */
                let buildResult;
                if (body.password !== undefined) {
                    buildResult = this.buildFromInput(body);
                } else {
                    buildResult = Validator
                        .validateObject(body, UserController.USER_SCHEMA__PARTIAL)
                        .map((value) => {
                            return {
                                name: body.name,
                                username: body.username,
                                password: record.password
                            };
                        })
                    ;
                }

                if (buildResult.isError()) {
                    const message = buildResult.getLeft();
                    return Controller.RESPONSE_TYPE.WRONG_INPUT(response)(message);
                }
                
                /** @type {UserController_Internal_Incomplete} */
                const internalObject = buildResult.getRight();
                const payload = this.convertToPayload(internalObject);

                return this.connection
                    .doc(id)
                    .update(payload)
                    .then(() => Controller.RESPONSE_TYPE.SUCCESS(response)("El registro se actualizó correctamente"))
                ;
            })
            .catch(Controller.RESPONSE_TYPE.BAD_RESPONSE(response))
        ;
    }
}

module.exports = UserController.INSTANCE;
