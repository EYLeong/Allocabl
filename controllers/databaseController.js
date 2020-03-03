const { getAgent } = require("../helpers/databaseManager");

const getAgentID = (req, res) => {
    getAgent(
        req.body.department,
        agentID => {
            console.log(agentID);
            res.send(agentID);
        },
        err => {
            console.log(err);
            res.status(400).send("database error");
        }
    );
};

module.exports = { getAgentID };
