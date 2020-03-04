const {
    getAgent,
    toggleAgentAvailability,
    incrementCustomersServed
} = require("../helpers/databaseManager");

const getAgentID = (req, res) => {
    getAgent(
        req.body.department,
        agentID => {
            console.log(agentID);
            res.send(agentID);
            toggleAgentAvailability(
                agentID,
                err => console.log(err),
                result => console.log(result)
            );
            incrementCustomersServed(
                agentID,
                err => console.log(err),
                result => console.log(result)
            );
        },
        err => {
            console.log(err);
            res.status(400).send("database error");
        }
    );
};

module.exports = { getAgentID };
