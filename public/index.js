import { rainbowInit } from "./modules/rainbowWebHelpers.js";
import { customError, loginInfo } from "./modules/socketEventsClient.js";
import { initialPrompt, connected } from "./modules/botUIHelpers.js";

/* Wait for the page to load */
$(function() {
    rainbowInit();

    const botui = new BotUI("allocablPrompt");

    const socket = io({ autoConnect: false });

    var msgCount=0;

    setInterval(resetMessageCount, 60000);

    function resetMessageCount() {
        msgCount=0;
    }

    socket.on("loginInfo", async info => {
        let conversation = await loginInfo(rainbowSDK, info);
        connected(botui, res => {
            if (msgCount<5) {
                msgCount++;
                rainbowSDK.im.sendMessageToConversation(conversation, res.value);
            }
            else {
                botui.message.add({content: "Your message was not received by the agent. You can only send 5 messages every minute."});
            }
        });
    });
    socket.on("customError", async msg => {
        customError(msg);
        await botui.message.add({ content: msg });
        let dept = await initialPrompt(botui);
        if (dept) socket.emit("loginGuest", dept);
    });
    socket.on("waitList", async msg => {
        await botui.message.add({ content: msg });
    });
    socket.on("agentAvailable", async msg => {
        await botui.message.add({ content: msg });
    });

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, async () => {
        console.log("[DEMO] :: On Rainbow Ready!");
        let dept = await initialPrompt(botui);
        if (dept) {
            socket.connect();
            socket.emit("loginGuest", dept);
        }
    });

    document.addEventListener(
        rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
        event => {
            let msg=event.detail.message.data;
            let conversation=event.detail.conversation;
            if (msg==="/endchat") {
                socket.disconnect(true);
                rainbowSDK.im.sendMessageToConversation(conversation, "Successfully disconnected.");
                botui.message.add({ content: "You have been disconnected." });
                botui.action.hide();
            }
            else {
                botui.message.add({ content: msg })
            }
        }
    );
});
