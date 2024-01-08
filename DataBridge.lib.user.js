const DataBridge = (function () {
    function info() {
        const name = "DataBridge";
        const version = "1.1.0";
        const author = "black-backdoor";
        const description = "DataBridge is a library for communication between scripts";
        const homepage = "https://github.com/black-backdoor/DataBridge/";
        return {
            name: name,
            version: version,
            author: author,
            description: description,
            homepage: homepage,
        };
    }

    return {
        info: info
    };
}) ();

const GMinfo = GM_info ?? GM?.info ?? (() => {});  // Get GM_info from either GM.info or GM_info or return an empty object

const ScriptInfo  = {
    name: GMinfo?.script?.name || undefined,
    version: GMinfo?.script?.version || undefined,
    run_at: GMinfo?.script?.runAt || GMinfo?.script?.options?.run_at || undefined,
    scriptWillUpdate: GMinfo?.scriptWillUpdate || GMinfo?.script?.options?.check_for_updates || undefined,

    // URLs
    downloadURL: GMinfo?.script?.downloadURL || undefined,
    updateURL: GMinfo?.script?.updateURL || undefined,
    
    permissions: GMinfo?.script?.grant || undefined,
};


class Connection {
    static channelTypes = {
        Window: "Window",
    };

    constructor(channelName, channelType) {
        if (channelType === undefined) channelType = Connection.channelTypes.Window;

        this.channelName = channelName;
        this.channelType = channelType;
    }

    getChannelName() {
        return this.channelName;
    }

    send(message){
        // add protocol version and sender to message header
        message.header.sender = GMinfo.script.name;
        message.header.protocolVersion = "1.0";

        // check if message is valid if not warn
        if (Protocol.verifyMessage(message) == false) console.warn("Message is not valid", message);
        
        var event = new CustomEvent(this.channelName, { detail: message });
        document.dispatchEvent(event);
    }

    receive(callback){
        // check if callback is valid if not warn
        if (callback === undefined) console.warn("No callback function provided");
        if (typeof callback !== "function") console.warn("Callback is not a function");

        document.addEventListener(this.channelName, (event) => {
            const message = event.detail;
            
            // check if message is valid
            if(Protocol.verifyMessage(message) == false) return;
            if(message.header.receiver != GMinfo.script.name && message.header.receiver != "*") return;
            
            callback(message);
        });
    }

    debugMessageHook(callback){
        // diffrent than receive this function will not check if the message is valid 
        document.addEventListener(this.channelName, (event) => {
            const message = event.detail;
            callback(message);
        });
    }
}

const Protocol = (function () {
    function verifyMessage(message) {
        const expectedHeaders = ["sender", "receiver", "protocolVersion", "messageType"];

        // check if message has header
        if (!message.hasOwnProperty("header")) return false;

        // check if header has all expected header keys
        const headerKeysExist = expectedHeaders.every(key => message.header.hasOwnProperty(key));
        if (!headerKeysExist) return false;

        return true;
    }


    function registerMessageType (connection, messageType, callback){
        connection.receive((message) => {
            if (message.header.messageType == messageType) {
                callback(message);
            }
        });
    }
    
    function dispatchEvent (connection, eventName, detail, reciever){
        const message = {
            "header": {
                "receiver": reciever,
                "messageType": "EVENT",
            },
            "body": {
                "eventName": eventName,
                "detail": detail,
            }
        };

        connection.send(message);
    }

    function registerEvent (connection, eventName, callback){
        connection.receive((message) => {
            if (message.header.messageType == "EVENT" && message.body.eventName == eventName) {
                callback(message);
            }
        });
    }

    return {
        verifyMessage: verifyMessage,
        dispatchEvent: dispatchEvent,
        registerEvent: registerEvent,
        registerMessageType: registerMessageType,
    };
})();

const SystemProtocol = (function () {
    function registerPing(connection){
        // register PING message type and send PONG if PING is received
        Protocol.registerMessageType(connection, "PING", (message) => {
            if (message.body.request == "PING") {
                // if message body is PING, send PONG
                const pongMessage = {
                    "header": {
                        receiver: message.header.sender,
                        messageType: "PING",
                        
                    },
                    "body": {
                        request: "PONG",
                        pingID: message.body.pingID
                    }
                        
                };
                
                connection.send(pongMessage);
            }
        }    
            
        );
    }

    /*
    function registerInfo(connection){
        // register INFO message type and send INFO if INFO is received
        Protocol.registerMessageType(connection, "INFO", (message) => {
            if (message.body == "INFO") {
                // if message body is INFO, send INFO
                const infoMessage = {
                    "header": {
                        "receiver": message.header.sender,
                        "messageType": "INFO",
                    },
                    "body": {
                        "name": ScriptInfo.name,
                        "version": ScriptInfo.version,
                        "run_at": ScriptInfo.run_at,
                        "scriptWillUpdate": ScriptInfo.scriptWillUpdate,
                        "downloadURL": ScriptInfo.downloadURL,
                        "updateURL": ScriptInfo.updateURL,
                        "permissions": ScriptInfo.permissions,
                    }
                };
                
                connection.send(infoMessage);
            }
        });
    }
    */

    function sendJoin(connection){
        const joinMessage = {
            "header": {
                "receiver": "*",
                "messageType": "JOIN",
            },
            "body": {
                "channelName": connection.getChannelName(),
            }
        };

        connection.send(joinMessage);
    }

    function init(connection) {
        registerPing(connection);
    }

    return {
        sendJoin: sendJoin,
        init: init,
    };
})();


const Tools = (function () {
    async function PING(connection, reciever, timeout = 5000) {
        var pingID = Math.random();

        const result = new Promise(resolve => {
            Protocol.registerMessageType(connection, "PING", function (message) {
                // if message body is PING, we dont need to do anything
                if (message.body.request == "PING") return;
                if (message.body.request == "PONG" && message.body.pingID == pingID) {
                    resolve(true);
                }
            });

            const pingMessage = {
                "header": {
                    "receiver": reciever,
                    "messageType": "PING",
                },
                "body": {
                    request: "PING",
                    pingID: pingID
                }
            };
            connection.send(pingMessage);

            // Set a timeout to resolve the promise with false if no valid pong is received within the specified duration
            setTimeout(() => {
                resolve(false);
            }, timeout);
        });

        console.log("Sending ping...");
        try {
            const pongReceived = await result;
            
            if (pongReceived) {
                console.log("Pong received!");
            } else {
                console.log("No valid pong received within the timeout.");
            }
        } catch (error) {
            console.error("Error sending ping:", error);
        }

    }

    return {
        PING: PING,
    };
})();
