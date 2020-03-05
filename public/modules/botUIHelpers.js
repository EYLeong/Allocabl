const initialPrompt = (botui, deptCallback) => {
    botui.message
        .add({
            // show a message
            content: "Hi there! Would you like to talk to an agent?"
        })
        .then(() => {
            // wait till its shown
            return botui.action.button({
                // show 'text' action
                action: [
                    {
                        text: "Yes!",
                        value: "yes"
                    },
                    {
                        text: "No thanks",
                        value: "no"
                    }
                ]
            });
        })
        .then(res => {
            // get the result
            if (res.value == "yes") {
                departmentPrompt(botui, deptCallback);
            } else {
                botui.message.add({
                    delay: 500,
                    content: "K"
                });
            }
        });
};

const departmentPrompt = (botui, deptCallback) => {
    botui.message
        .add({
            delay: 500,
            content: "Department?"
        })
        .then(() => {
            return botui.action.button({
                delay: 300,
                action: [
                    {
                        text: "Sales",
                        value: "sales"
                    },
                    {
                        text: "Finance",
                        value: "finance"
                    },
                    {
                        text: "General",
                        value: "general"
                    }
                ]
            });
        })
        .then(res => {
            departmentChosen(botui, res.value, deptCallback);
        });
};

const departmentChosen = (botui, dept, deptCallback) => {
    if (dept == "sales") {
        botui.message.add({
            // show a message
            delay: 300,
            content: "Connecting you to a sales agent..."
        });
    } else if (dept == "finance") {
        botui.message.add({
            // show a message
            delay: 300,
            content: "Connecting you to a finance agent..."
        });
    } else if (dept == "general") {
        botui.message.add({
            // show a message
            delay: 300,
            content: "Connecting you to a general agent..."
        });
    }
    deptCallback(dept);
};

const connected = (botui, resCallback) => {
    botui.message.removeAll();
    botui.message
        .add({
            content: "You are now connected!"
        })
        .then(() => {
            textInput(botui, resCallback);
        });
};

const textInput = async (botui, resCallback) => {
    let result = await botui.action.text({
        action: {
            placeholder: "Type here"
        }
    });
    resCallback(result);
    textInput(botui, resCallback);
};

export { initialPrompt, connected };
