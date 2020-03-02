const connectGuest = async (rainbowSDK, guestToken, agentID) => {
    let account = await rainbowSDK.connection.signinSandBoxWithToken(
        guestToken
    );
    let contact = await rainbowSDK.contacts.searchById(agentID);
    if (contact) {
        let conversation = await rainbowSDK.conversations.openConversationForContact(
            contact
        );
        rainbowSDK.im.sendMessageToConversation(conversation, "Test");
        return conversation;
    } else {
        throw new Error("null contact");
    }
};

const onNewMessageReceived = event => {
    console.log(event.detail.message.data);
};

export { connectGuest, onNewMessageReceived };
