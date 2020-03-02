const express = require("express");
const app = express();
const port = 3000;

const rainbowRouter = require("./routes/rainbow");
const databaseRouter = require("./routes/database");

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use("/rainbow", rainbowRouter);
app.use("/database", databaseRouter);
