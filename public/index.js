import { rainbowInit } from "./modules/rainbowWebHelpers.js";
import { customError, loginInfo } from "./modules/socketEventsClient.js";
import { initialPrompt, connected, textInput } from "./modules/botUIHelpers.js";

/* Wait for the page to load */
$(function () {
    rainbowInit();

    const botui = new BotUI("allocablPrompt");

    const socket = io({ autoConnect: false });

    var msgCount = 0;
    let warningCount = 0;
    let next = true;

    setInterval(resetMessageCount, 3000);

    function resetMessageCount() {
        msgCount = 0;
    }

    const reprompt = async () => {
        let inputs = await initialPrompt(botui);
        if (inputs[0]!=null) {
            socket.emit("loginGuest", inputs);
        }
    };

    const forceDisconnect = async (conversation) => {
        next = false;
        socket.disconnect(true);
        await rainbowSDK.im.sendMessageToConversation(
            conversation,
            "Successfully disconnected."
        );
        await rainbowSDK.connection.signout();
        await botui.message.add({ content: "You have been disconnected." });
        await botui.action.hide();
    };

    const processInput = async (input, conversation) => {
        msgCount++;
        if (msgCount < 5) {
            console.log(input);
            rainbowSDK.im.sendMessageToConversation(conversation, input);
        } else {
            await botui.message.add({
                content:
                    "Your message was not received by the agent. You can only send 5 messages every 3 seconds.",
            });
            if (msgCount === 5) {
                warningCount++;
                if (warningCount === 3) {
                    await forceDisconnect(conversation);
                }
            }
        }
    };

    socket.on("loginInfo", async (info) => {
        let conversation = await loginInfo(rainbowSDK, info);
        await connected(botui, conversation);
        while (next) {
            let input = await textInput(botui);
            await processInput(input.value, conversation);
        }
    });

    socket.on("customError", async (msg) => {
        customError(msg);
        await botui.message.add({ content: msg });
        reprompt();
    });
    socket.on("waitList", async (msg) => {
        await botui.message.add({ content: msg });
    });
    socket.on("agentAvailable", async (msg) => {
        await botui.message.add({ content: msg });
    });

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, async () => {
        console.log("[DEMO] :: On Rainbow Ready!");
        //inputs[0] is department, inputs[1] is agent
        let inputs = await initialPrompt(botui);
        if (inputs[0]!=null) {
            socket.connect();
            socket.emit("loginGuest", inputs);
        }
    });

    document.addEventListener(
        rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
        (event) => {
            let msg = event.detail.message.data;
            let conversation = event.detail.conversation;
            if (msg === "/endchat") {
                forceDisconnect(conversation);
            } else {
                botui.message.add({ content: msg });
            }
        }
    );
});
