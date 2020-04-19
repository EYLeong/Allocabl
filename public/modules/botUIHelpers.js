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
        return [null, null];
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
    return agentPrompt(botui, res.value);
};

const agentPrompt = async (botui, dept) => {
    await botui.message.add({
        // show a message
        delay: 300,
        content: "Do you have any specific agent you would like to speak to?"
    });
    let res = await botui.action.button({
        // show 'text' action
        action: [
            {
                text: "Yes",
                value: "yes"
            },
            {
                text: "No",
                value: "no"
            }
        ]
    });
    document.getElementsByTagName("button")[0].setAttribute("id", "yes");
    if (res.value === "yes") {
        return connectWithAgent(botui, dept);
    } else {
        return connectWithoutAgent(botui, dept)
    }
};

const connectWithAgent = async(botui, dept) => {
    let agent = await agentPromptName(botui);
    await botui.message.add({
        // show a message
        delay: 300,
        content: `Connecting you to agent ${agent} from ${dept} department..`
    });
    return [dept, agent];
}

const agentPromptName = async (botui) => {
    let agent = await botui.action.text({
        action: {
            placeholder: "Enter agent name"
        }
    });
    return agent.value;
}

const connectWithoutAgent = async (botui, dept) => {
    await botui.message.add({
        // show a message
        delay: 300,
        content: `Connecting you to a ${dept} agent...`
    });
    return [dept, null];
};

const connected = async (botui, conversation) => {
    await botui.message.removeAll();
    console.log(conversation);
    await botui.message.add({
        content: "You are now connected!"
    });
    await botui.message.add({
        content: `Chatting with ${conversation.contact.firstname}`
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
