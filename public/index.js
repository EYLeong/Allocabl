import {
    connectGuest,
    onNewMessageReceived
} from "./modules/rainbowWebHelpers.js";

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

        document.getElementById("loginBtn").disabled = false;
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(true);

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

    document.getElementById("loginBtn").onclick = () => {
        $.ajax({
            type: "post",
            url: "/database/getAgent",
            contentType: "application/json",
            data: JSON.stringify({ department: "sales" }),
            error: err => console.log(err),
            success: data => console.log(data)
        });
        // $.get("/rainbow/createGuest", (data, status) => {
        //     connectGuest(rainbowSDK, data, "5e440358e9f1273063695865")
        //         .then(conversation => {
        //             console.log(conversation);
        //         })
        //         .catch(err => console.log(err));
        // }).fail(err => {
        //     console.log(err);
        // });
    };

    document.addEventListener(
        rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
        onNewMessageReceived
    );

    /* Load the SDK */
    rainbowSDK.load();
});
