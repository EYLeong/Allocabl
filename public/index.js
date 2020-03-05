/* Wait for the page to load */
$(function() {
    console.log("[DEMO] :: Rainbow Application started!");

    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "6eb85d004cb111ea819a43cb4a9dae9b";
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

    /* Load the SDK */
    rainbowSDK.load();

    // ---------------------- CONTACT USER1 ------------------------------

        //document.getElementById("loginBtn").onclick = () => {
        document.getElementById("btn_IT").onclick = () => {
            // document.getElementById("status").innerHTML =
            //     "Waiting for server response";
            $.get("/guestLogin", (data) => { //(data, status)
                // console.log(data, status);
                // document.getElementById("status").innerHTML =
                //     "Guest login token received - Logging in";
                rainbowSDK.connection
                    .signinSandBoxWithToken(data)
                    .then(account => {
                        console.log(account);
                        document.getElementById("status").innerHTML =
                            "Connected, getting agent contact";
                        rainbowSDK.contacts
                            .searchById("5e5bf1116c332176648fdf29")
                            .then(contact => {
                                console.log(contact);
                                if (contact) {
                                    document.getElementById("status").innerHTML =
                                        "Agent contact received, creating conversation";
                                    rainbowSDK.conversations
                                        .openConversationForContact(contact)
                                        .then(conversation => {
                                            console.log(conversation);
                                            document.getElementById(
                                                "status"
                                            ).innerHTML =
                                                "Conversation created, sending test message";
                                            rainbowSDK.im.sendMessageToConversation(
                                                conversation,
                                                "Test"
                                            );
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            document.getElementById(
                                                "status"
                                            ).innerHTML =
                                                "Conversation creation error";
                                        });
                                } else {
                                    document.getElementById("status").innerHTML =
                                        "Null contact received";
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                document.getElementById("status").innerHTML =
                                    "Retrieve contact error";
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        document.getElementById("status").innerHTML =
                            "Sign in error";
                    });
            }).fail(err => {
                console.log(err);
                document.getElementById("status").innerHTML = err.responseText;
            });
        };


   // ---------------------- CONTACT USER2 ------------------------------
    document.getElementById("btn_Finance").onclick = () => {
        document.getElementById("status").innerHTML =
            "Waiting for server response";
        $.get("/guestLogin", (data, status) => {
            console.log(data, status);
            rainbowSDK.connection
                .signinSandBoxWithToken(data)
                .then(account => {
                    console.log(account);
                    document.getElementById("status").innerHTML =
                        "Connected, getting agent contact";
                    rainbowSDK.contacts
                        .searchById("5e5bf1116c332176648fdf29")
                        .then(contact => {
                            console.log(contact);
                            if (contact) {
                                document.getElementById("status").innerHTML =
                                    "Agent contact received, creating conversation";
                                rainbowSDK.conversations
                                    .openConversationForContact(contact)
                                    .then(conversation => {
                                        console.log(conversation);
                                        document.getElementById(
                                            "status"
                                        ).innerHTML =
                                            "Conversation created, sending test message";
                                        rainbowSDK.im.sendMessageToConversation(
                                            conversation,
                                            "Test"
                                        );
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        document.getElementById(
                                            "status"
                                        ).innerHTML =
                                            "Conversation creation error";
                                    });
                            } else {
                                document.getElementById("status").innerHTML =
                                    "Null contact received";
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            document.getElementById("status").innerHTML =
                                "Retrieve contact error";
                        });
                })
                .catch(err => {
                    console.log(err);
                    document.getElementById("status").innerHTML =
                        "Sign in error";
                });
        }).fail(err => {
            console.log(err);
            document.getElementById("status").innerHTML = err.responseText;
        });
    };

   // ---------------------- CONTACT USER3 ------------------------------

    document.getElementById("btn_General").onclick = () => {
        document.getElementById("status").innerHTML =
            "Waiting for server response";
        $.get("/guestLogin", (data, status) => {
            console.log(data, status);
            rainbowSDK.connection
                .signinSandBoxWithToken(data)
                .then(account => {
                    console.log(account);
                    document.getElementById("status").innerHTML =
                        "Connected, getting agent contact";
                    rainbowSDK.contacts
                        .searchById("5e5bf12c6c332176648fdf31")
                        .then(contact => {
                            console.log(contact);
                            if (contact) {
                                document.getElementById("status").innerHTML =
                                    "Agent contact received, creating conversation";
                                rainbowSDK.conversations
                                    .openConversationForContact(contact)
                                    .then(conversation => {
                                        console.log(conversation);
                                        document.getElementById(
                                            "status"
                                        ).innerHTML =
                                            "Conversation created, sending test message";
                                        rainbowSDK.im.sendMessageToConversation(
                                            conversation,
                                            "Test"
                                        );
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        document.getElementById(
                                            "status"
                                        ).innerHTML =
                                            "Conversation creation error";
                                    });
                            } else {
                                document.getElementById("status").innerHTML =
                                    "Null contact received";
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            document.getElementById("status").innerHTML =
                                "Retrieve contact error";
                        });
                })
                .catch(err => {
                    console.log(err);
                    document.getElementById("status").innerHTML =
                        "Sign in error";
                });
        }).fail(err => {
            console.log(err);
            document.getElementById("status").innerHTML = err.responseText;
        });
    };
    
    function openForm() {
        document.getElementById("myForm").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("myForm").style.display = "none";
      }

});