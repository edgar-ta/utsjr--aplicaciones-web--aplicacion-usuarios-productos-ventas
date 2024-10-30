const router = require("express").Router();
const UserController = require("../db/user");

router.get("/all", async (request, response) => {
    UserController.getAll()
        .then(users => {
            response.json(users.map(UserController.buildForUpload));
        })
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
    ;
});

router.post("/new", async (request, response) => {
    const body = request.body;
    const result = UserController.build(body);
    if (result.isError()) {
        const message = result.getLeft();
        response.json({ type: "Wrong Input", details: message });
        return;
    }

    const data = result.getRight();
    UserController.insert(data)
        .then(() => response.json({ type: "Success", details: "The user data was inserted successfully" }))
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
        ;
})

router.get("/find/:id", async (request, response) => {
    const id = request.params.id;
    if (id === undefined || id === null || id === "") {
        response.json({ type: "Bad URL", details: "La URL debería incluir el parámetro 'id'" });
        return;
    }

    const user = await UserController.find(id);
    if (user.isEmpty()) {
        response.json({ type: "Not found", details: "El usuario con la id especificada no existe" })
    } else {
        const data = user.unwrap();
        const payload = UserController.buildForUpload(data);

        response.json(payload);
    }
})

router.delete("/delete/:id", async (request, response) => {
    const id = request.params.id;
    if (id === undefined || id === null || id === "") {
        response.json({ type: "Bad URL", details: "La URL debería incluir el parámetro 'id'" });
        return;
    }
    
    await UserController
        .delete(id)
        .then(() => response.json({ type: "Success", details: "El usuario especificado se eliminó correctamente" }))
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
        ;
})

module.exports = router;
