import { rainbowInit } from "./modules/rainbowWebHelpers.js";
import { customError, loginInfo } from "./modules/socketEventsClient.js";
import { initialPrompt, connected } from "./modules/botUIHelpers.js";

/* Wait for the page to load */
$(function() {
    rainbowInit();

    const botui = new BotUI("allocablPrompt");

    const socket = io({ autoConnect: false });

    socket.on("loginInfo", info =>
        loginInfo(rainbowSDK, info, conversation =>
            connected(botui, res =>
                rainbowSDK.im.sendMessageToConversation(conversation, res.value)
            )
        )
    );
    socket.on("customError", msg => {
        customError(msg);
        botui.message.add({ content: msg }).then(
            initialPrompt(botui, dept => {
                socket.emit("loginGuest", dept);
            })
        );
    });

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, () => {
        console.log("[DEMO] :: On Rainbow Ready!");
        initialPrompt(
            botui,
            dept => {
                socket.connect();
                socket.emit("loginGuest", dept);
            },
            err => console.log(err)
        );
    });

    document.addEventListener(
        rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
        event => botui.message.add({ content: event.detail.message.data })
    );
});
