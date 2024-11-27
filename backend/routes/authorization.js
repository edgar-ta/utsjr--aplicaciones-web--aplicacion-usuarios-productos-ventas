const session = require("express-session");
const UserController = require("../db/user");
const EncryptedString = require("../lib/encrypted-string");

const router = require("express").Router();

/**
 * Creates a login session for the given user and password;
 * it is a smart method, which means that it checks its inputs
 * before actually creating side effects
 * @param {string} name Id of the user
 * @param {string} password Password of the user
 * @param {Response<any, Record<string, any>, number>} response
 * @returns {Promise<{ userData: import("../db/user").UserController_Internal_Complete, isRightPassword: boolean }>}
 */
async function login(name, password) {
    return UserController.connection.where("name", "==", name).get().then(querySnapshot => {
        if (querySnapshot.docs.length <= 0) {
            throw new Error("No existe un usuario con el nombre dado");
        }
        return querySnapshot.docs[0].data();
    })
    .then(userData => {
        const encryptedPassword = EncryptedString.buildFromEncryption(userData.salt, userData.hash);
        const isRightPassword = encryptedPassword.isEqualToString(password);

        return {
            userData,
            isRightPassword
        };
    })
}

router.post("/login", async (request, response) => {
    await login(request.body.userName, request.body.userPassword)
        .then(({ userData, isRightPassword }) => {
            if (isRightPassword) {
                const loginData = {
                    isLoggedIn: true,
                    userType: userData.userType
                };
                request.session.loginData = loginData;
                response.json({ user: userData });
            } else {
                response.json({ user: [ 1, 2, 3 ] })
            }
        })
        .catch(error => {
            console.log("The error is: ", error);
            response.json({ error: error.message });
        })
    ;
});

module.exports = router;
