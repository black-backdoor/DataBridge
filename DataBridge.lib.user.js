// Library Info
const DataBridge = (function () {
    function info() {
        const name = "DataBridge";
        const version = "1.3.0";
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

    function checkRequirements(){
        // Check if the script is running in a browser environment
        if (typeof window === "undefined") {
            throw new Error("DataBridge: Script is not running in a browser environment | window is undefined");
        }

        // Check if the script is running in a userscript manager environment
        if (typeof GMinfo === "undefined") {
            throw new Error("DataBridge: Script is not running in a userscript manager environment | GMinfo is undefined");
        }
    }

    return {
        info: info,
        checkRequirements: checkRequirements,
    };
}) ();


// ########### SCRIPT INFO ###########
const GMinfo = GM_info ?? GM?.info ?? (() => {});  // Get GM_info from either GM.info or GM_info or return an empty object

const ScriptInfo  = {
    name: GMinfo?.script?.name || undefined,
    namespace: GMinfo?.script?.namespace || undefined,
    description: GMinfo?.script?.description || undefined,

    version: GMinfo?.script?.version || undefined,
    permissions: GMinfo?.script?.grant || undefined,

    run_at: GMinfo?.script?.runAt || GMinfo?.script?.options?.run_at || undefined,
    scriptWillUpdate: GMinfo?.scriptWillUpdate || GMinfo?.script?.options?.check_for_updates || undefined,

    isFirstPartyIsolation: GMinfo?.isFirstPartyIsolation || undefined,
    injectInto: GMinfo?.injectInto || undefined,
    sandboxMode: GMinfo?.sandboxMode || undefined,
    sandbox: GMinfo?.script?.options?.sandbox || undefined,

    // SCRIPT URLs
    downloadURL: GMinfo?.script?.downloadURL || undefined,
    updateURL: GMinfo?.script?.updateURL || undefined,
};

// ########### BROWSER INFO ###########
const browser = {
    browserName: GMinfo?.platform?.browserName,
    browserVersion: GMinfo?.platform?.browserVersion,
    os: GMinfo?.platform?.os || navigator?.userAgentData?.platform || navigator?.userAgent?.platform,

    language: navigator?.language || undefined,
    languages: navigator?.languages || undefined,

    userAgent: navigator?.userAgent || undefined,
    userAgentData: navigator?.userAgentData || undefined,

    isIncognito: GMinfo?.isIncognito || undefined,
    cookiesEnabled: navigator?.cookieEnabled || undefined,
    online: navigator?.onLine || undefined,
};

// ########### SCRIPTHANDLER INFO ###########
const scriptHandler = {
    scriptHandler: GMinfo?.scriptHandler || undefined,
    scriptHandlerVersion: GMinfo?.version || undefined,
};

// ####################################################################################################

// CONNECTION
class Connection {
    static channelTypes = {
        Window: "Window",
    };

    constructor(channelName, channelType) {
        /**
         * Constructor for the Connection class.
         * @param {string} channelName - The name of the communication channel.
         * @param {string} channelType - The type of communication channel (default is Window).
         */
        
        // Set default channel type if not provided
        if (channelType === undefined) channelType = Connection.channelTypes.Window;

        // Initialize properties
        this.channelName = channelName;
        this.channelType = channelType;

        // Check requirements
        DataBridge.checkRequirements();
        
        // Initialize default protocol
        defaultProtocol.init(this);
    }

    getChannelName() {
        /**
         * Get the channel name associated with the connection.
         * @returns {string} - The channel name.
         */
        return this.channelName;
    }

    send(message) {
        /**
         * Send a message through the connection.
         * @param {object} message - The message to be sent.
         */

        // Add protocol version and sender to the message header
        message.header.sender = message.header.sender || GMinfo.script.name;
        message.header.protocolVersion = message.header.protocolVersion || "1.0";

        // Check if the message is valid; if not, warn
        if (!Protocol.verifyMessage(message)) {
            console.warn("Message is not valid", message);
            return;
        }

        const event = new CustomEvent(this.channelName, { detail: message });
        document.dispatchEvent(event);
    }

    receive(callback) {
        /**
         * Set up a callback to receive messages.
         * @param {function} callback - The callback function to handle received messages.
         */
        
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
        /**
         * Set up a callback for debugging purposes without validating the message.
         * @param {function} callback - The callback function to handle messages.
         */
        
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

        /*
            pingID is used to identify the PING request
        */
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

const Tools = (function () {
    function PING(connection, receiver) {
        const pingID = Math.random();
        const pingMessage = {
            "header": {
                receiver: receiver,
                messageType: "PING",
                
            },
            "body": {
                request: "PING",
                pingID: pingID
            }
                
        };
        connection.send(pingMessage);
    }

    return {
        PING: PING,
    };
})();