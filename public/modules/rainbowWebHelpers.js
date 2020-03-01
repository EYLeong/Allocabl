/**
 * @description Async function that connects guest to target agent and sends a test message
 * @return {*} conversation object between guest and target agent
 * @param {*} rainbowSDK Initialized rainbowSDK variable
 * @param {string} guestToken Token for guest account
 * @param {string} agentID ID for target agent
 */
const connectGuest = async (rainbowSDK, guestToken, agentID) => {
    let account = await rainbowSDK.connection.signinSandBoxWithToken(
        guestToken
    );
    console.log(account);
    let contact = await rainbowSDK.contacts.searchById(agentID);
    console.log(contact);
    if (contact) {
        let conversation = await rainbowSDK.conversations.openConversationForContact(
            contact
        );
        console.log(conversation);
        rainbowSDK.im.sendMessageToConversation(conversation, "Test");
        return conversation;
    } else {
        throw new Error("null contact");
    }
};

export { connectGuest };
