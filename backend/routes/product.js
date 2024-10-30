const router = require("express").Router();
const ProductController = require("../db/product");

router.get("/all", async (request, response) => {
    ProductController.getAll()
        .then(products => {
            response.json(products.map(ProductController.buildForUpload));
        })
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
    ;
});

router.post("/new", async (request, response) => {
    const body = request.body;
    const result = ProductController.build(body);
    if (result.isError()) {
        const message = result.getLeft();
        response.json({ type: "Wrong Input", details: message });
        return;
    }

    const data = result.getRight();
    ProductController.insert(data)
        .then(() => response.json({ type: "Success", details: "La información del producto se ingresó correctamente" }))
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
        ;
})

router.get("/find/:id", async (request, response) => {
    const id = request.params.id;
    if (id === undefined || id === null || id === "") {
        response.json({ type: "Bad URL", details: "La URL debería incluir el parámetro 'id'" });
        return;
    }

    const user = await ProductController.find(id);
    if (user.isEmpty()) {
        response.json({ type: "Not found", details: "El producto con la id especificada no existe" })
    } else {
        const data = user.unwrap();
        const payload = ProductController.buildForUpload(data);

        response.json(payload);
    }
})

router.delete("/delete/:id", async (request, response) => {
    const id = request.params.id;
    if (id === undefined || id === null || id === "") {
        response.json({ type: "Bad URL", details: "La URL debería incluir el parámetro 'id'" });
        return;
    }
    
    await ProductController
        .delete(id)
        .then(() => response.json({ type: "Success", details: "El producto especificado se eliminó correctamente" }))
        .catch((reason) => response.json({ type: "Bad response", details: reason }))
        ;
})

module.exports = router;
