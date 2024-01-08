const DataBridge = (function () {
    function info() {
        const name = "DataBridge";
        const version = "1.0.0";
        const author = "black-backdoor";
        const description = "DataBridge is a library for communication between scripts";
        const homepage = "";
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
