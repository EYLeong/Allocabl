/**
 * @description Async function that creates an anonymous guest user and retrieves the token
 * @returns {string} Anonymous guest account token as string
 * @param {*} rainbowSDK Initialized rainbow SDK variable
 */

const getGuestToken = async rainbowSDK => {
    let user = await rainbowSDK.admin.createAnonymousGuestUser();
    let json = await rainbowSDK.admin.askTokenOnBehalf(
        user.loginEmail,
        user.password
    );
    console.log(json);
    return json.token;
};

module.exports = {
    getGuestToken
};
