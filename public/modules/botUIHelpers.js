const initialPrompt = async botui => {
    await botui.message.add({
        // show a message
        content: "Hi there! Would you like to talk to an agent?"
    });
    let res = await botui.action.button({
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
    document.getElementsByTagName("button")[0].setAttribute("id", "yes");
    if (res.value === "yes") {
        return departmentPrompt(botui);
    } else {
        await botui.message.add({
            delay: 500,
            content: "K"
        });
        return null;
    }
};

const departmentPrompt = async botui => {
    await botui.message.add({
        delay: 500,
        content: "Department?"
    });
    let res = await botui.action.button({
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
    return departmentChosen(botui, res.value);
};

const departmentChosen = async (botui, dept) => {
    await botui.message.add({
        // show a message
        delay: 300,
        content: `Connecting you to a ${dept} agent...`
    });
    return dept;
};

const connected = async botui => {
    await botui.message.removeAll();
    await botui.message.add({
        content: "You are now connected!"
    });
};

const textInput = async botui => {
    let result = await botui.action.text({
        action: {
            placeholder: "Type here"
        }
    });
    return result;
};

export { initialPrompt, connected, textInput };
