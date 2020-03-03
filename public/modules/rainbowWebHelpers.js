const connectGuest = async (rainbowSDK, guestToken, agentPref) => {
    let account = await rainbowSDK.connection.signinSandBoxWithToken(
        guestToken
    );

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/database/getAgent",
            contentType: "application/json",
            data: JSON.stringify(agentPref),
            error: err => reject(err),
            success: data => {
                try {
                    resolve(connectToAgent(rainbowSDK, data));
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
};

const connectToAgent = async (rainbowSDK, agentID) => {
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
