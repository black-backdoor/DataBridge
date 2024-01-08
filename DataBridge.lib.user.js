const DataBridge = (function () {
    function info() {
        const name = "DataBridge";
        const version = "1.2.0";
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

        defaultProtocol.init(this);
    }

    getChannelName() {
        return this.channelName;
    }

    send(message) {
        // Add protocol version and sender to the message header
        message.header = {
            sender: GMinfo.script.name,
            protocolVersion: "1.0",
        };

        // Check if the message is valid; if not, warn
        if (!Protocol.verifyMessage(message)) {
            console.warn("Message is not valid", message);
            return;
        }

        const event = new CustomEvent(this.channelName, { detail: message });
        document.dispatchEvent(event);
    }

    receive(callback) {
        // Check if the callback is valid; if not, warn
        if (!callback || typeof callback !== "function") {
            console.warn("Invalid callback function provided");
            return;
        }

        document.addEventListener(this.channelName, (event) => {
            const message = event.detail;

            // Check if the message is valid
            if (!Protocol.verifyMessage(message)) return;
            if (
                message.header.receiver !== GMinfo.script.name &&
                message.header.receiver !== "*"
            )
                return;

            callback(message);
        });
    }

    debugMessageHook(callback) {
        // Different than receive, this function will not check if the message is valid
        document.addEventListener(this.channelName, (event) => {
            const message = event.detail;
            callback(message);
        });
    }
}

const defaultProtocol = (function () {
    function registerPong (connection){
        // register PONG message type and send PONG if PING is received
        Protocol.registerMessageType(connection, "PING", (message) => {
            if (message.body.request == "PING") {
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
        });
    }

    function init(connection) {
        registerPong(connection);
    }

    return {
        init: init,
    };
})();

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
