const customError = msg => {
    console.error(msg);
};

const loginInfo = async (rainbowSDK, info, successCallback) => {
    let account = await rainbowSDK.connection.signinSandBoxWithToken(
        info.token
    );
    let contact = await rainbowSDK.contacts.searchById(info.agentID);
    if (contact) {
        let conversation = await rainbowSDK.conversations.openConversationForContact(
            contact
        );
        rainbowSDK.im.sendMessageToConversation(conversation, "Test");
        successCallback(conversation);
    } else {
        console.error("null contact");
    }
};

export { customError, loginInfo };
