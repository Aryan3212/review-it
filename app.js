const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { db } = require("./db");
const routes = require("./routes");
const methodOverride = require("method-override");
const app = express();
app.disable("x-powered-by");
app.set("view engine", "pug");
//app.set("views", path.join(__dirname, "views"));
db.init();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(routes);

const server = app.listen(3000, () => {
    console.log("Serving on 3000");
});

process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    console.log("Closing http server.");
    db.close();
    server.close((err) => {
        console.log("Http server closed.");
        process.exit(err ? 1 : 0);
    });
});
