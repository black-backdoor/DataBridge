# DataBridge
DataBridge is a library for communication between userscripts


# DEVELOPMENT HALTED 🛑

## Usage

To incorporate this userscript library, include the following tag in your userscript metadata:

```js
// @require     https://github.com/black-backdoor/DataBridge/raw/main/DataBridge.lib.user.js
```

## Todo
- [x] Check for required script permissions and use alternatives if permissions are not granted
- [ ] Allow for cross-window communication (using GM_setValue or local storage)
- [ ] Enable same-origin communication with local storage
- [ ] Enable cross-origin communication with an additional DataBridge userscript that stores messages in GM_setValue


## ToDo
Connection Types
- [x] Window (events)
- [ ] CrossWindow | LocalStorage & GM Storage
- [ ] SameOrigin | LocalStorage & GM Storage
- [ ] CrossOrigin | GM Storage


## Documentation
The documentation can be found [here](docs.md).

## Tools for Debugging
You can find a list of debugging tools [here](https://github.com/black-backdoor/DataBridge/tree/main/tools).

