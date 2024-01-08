// ==UserScript==
// @name        DEBUG: listener
// @description script which listens to messages from DataBridge and makes protocol responses
// @namespace   Violentmonkey Scripts
// @match       https://example.org/
// @grant       GM_info
// @version     1.0
// @author      black-backdoor (https://github.com/black-backdoor)
// @require     https://github.com/black-backdoor/DataBridge/raw/main/DataBridge.lib.user.js
// ==/UserScript==

// create connection
const globalConnection = new Connection("LOCAL-BRIDGE", Connection.channelTypes.LOCAL);

// register protocol
SystemProtocol.init(globalConnection);
