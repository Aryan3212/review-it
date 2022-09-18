const express = require("express");
const { db } = require("./db");
const routes = require("./routes");
const app = express();
// app.set("view engine", nunjucks);
//app.set("views", path.join(__dirname, "views"));
db.init();
app.use(express.json());
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
