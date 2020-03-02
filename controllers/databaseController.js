const { getAgent } = require("../helpers/databaseManager");

const getAgentID = (req, res) => {
    getAgent(req.body.department, id => {
        if (id == "ERROR") res.status(400).send("database error");
        else res.send(id);
    });
};

module.exports = { getAgentID };
