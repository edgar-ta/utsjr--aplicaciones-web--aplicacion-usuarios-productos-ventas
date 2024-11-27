const UserController = require("./db/user.js");
const ProductController = require("./db/product.js");
const SaleController = require("./db/sale.js");
const authorizationRoutes = require("./routes/authorization.js");

const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");

const port = process.env.PORT || 3_000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: "xdxdxd",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));


app.use("/user",    UserController.instance.routes);
app.use("/product", ProductController.instance.routes);
app.use("/sale",    SaleController.instance.routes);
app.use("/authorization",    authorizationRoutes);




app.listen(port, () => console.log(`http://localhost:${port}`));

