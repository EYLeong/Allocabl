const { getRainbowReady, getRainbowSDK } = require("../helpers/rainbowInit");

const createGuestAccount = async (req, res) => {
    if (getRainbowReady()) {
        try {
            let user = await getRainbowSDK().admin.createAnonymousGuestUser();
            let json = await getRainbowSDK().admin.askTokenOnBehalf(
                user.loginEmail,
                user.password
            );
            console.log(json);
            res.send(json.token);
        } catch (err) {
            console.log(err);
            res.status(400).send("rainbowSDK error");
        }
    } else {
        res.status(400).send("server not ready");
    }
};

module.exports = { createGuestAccount };
