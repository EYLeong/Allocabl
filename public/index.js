import { onNewMessageReceived } from "./modules/rainbowWebHelpers.js";

import { customError, loginInfo } from "./modules/socketEventsClient.js";

/* Wait for the page to load */
$(function() {
    console.log("[DEMO] :: Rainbow Application started!");

    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "b61d1e604d9c11ea819a43cb4a9dae9b";
    var applicationSecret = ""; // Initialize without app secret, then signin using token

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready!");
        // do something when the SDK is ready

        document.getElementById("loginGuest").disabled = false;
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(false);

        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(function() {
                console.log("[DEMO] :: Rainbow SDK is initialized!");
            })
            .catch(function(err) {
                console.log(
                    "[DEMO] :: Something went wrong with the SDK...",
                    err
                );
            });
    };

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

    document.addEventListener(
        rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
        onNewMessageReceived
    );

    document.getElementById("connect").onclick = () => {
        socket.connect();
        socket.on("customError", customError);
        socket.on("loginInfo", info => loginInfo(rainbowSDK, info));
    };

    document.getElementById("disconnect").onclick = () => {
        socket.disconnect();
    };

    document.getElementById("loginGuest").onclick = () => {
        socket.emit("loginGuest", 'sales');
    };

    /* Load the SDK */
    rainbowSDK.load();

    const socket = io({ autoConnect: false });
});
