// ==UserScript==
// @name        DEBUG: displayMessages
// @description display messages from DataBridge
// @namespace   Violentmonkey Scripts
// @match       https://example.org/
// @grant       GM_info
// @version     1.0
// @author      black-backdoor (https://github.com/black-backdoor)
// @require     https://github.com/black-backdoor/DataBridge/raw/main/DataBridge.lib.user.js
// ==/UserScript==

// create connection
const globalConnection = new Connection("LOCAL-BRIDGE", Connection.channelTypes.LOCAL);

// do not register protocols because this script is only for displaying messages
globalConnection.debugMessageHook((message) => {
    console.debug(
        `Message received:
        Sender: ${message.header.sender}
        Receiver: ${message.header.receiver}
        MessageType: ${message.header.messageType}
        ProtocolVersion: ${message.header.protocolVersion}`,
        message
    );
});