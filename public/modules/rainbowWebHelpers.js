const onNewMessageReceived = event => {
    console.log(event.detail.message.data);
};

export { onNewMessageReceived };
