const express = require("express");
const app = express();
const port = 3000;

const glRouter = require("./routes/guestLogin");

app.use(express.static("public"));

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use("/guestLogin", glRouter);
