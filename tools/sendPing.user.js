// ==UserScript==
// @name        DEBUG: send ping
// @description script which sends ping message to DataBridge
// @namespace   Violentmonkey Scripts
// @match       https://example.org/
// @grant       GM_info
// @version     1.0
// @author      black-backdoor (https://github.com/black-backdoor)
// @require     https://github.com/black-backdoor/DataBridge/raw/main/DataBridge.lib.user.js
// ==/UserScript==

// create connection
const globalConnection = new Connection("Window-BRIDGE", Connection.channelTypes.Window);

// Tools.PING(globalConnection, "*");