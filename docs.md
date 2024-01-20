# DataBridge Library Documentation

## Introduction

DataBridge is a JavaScript library designed to facilitate communication between different scripts or components within a web environment. This documentation provides an overview of the library's features, components, usage guidelines, and examples.

## Table of Contents

1. [Library Overview](#library-overview)
2. [Requirements](#requirements)
3. [Components](#components)
    - [DataBridge Info](#databridge-info)
    - [Connection Class](#connection-class)
    - [Protocol](#protocol)
    - [SystemProtocol](#systemprotocol)
    - [Tools](#tools)
4. [Usage Examples](#usage-examples)
5. [Functions](#public-functions)


## Library Overview
DataBridge aims to simplify communication between different parts of a web application or scripts running in various contexts, such as browser windows, tabs, or frames. It provides a structured approach to send, receive, and manage messages using custom events and protocols.


## Requirements
Ensure that your userscript has the necessary permission to access `GM_info`. This permission is crucial for retrieving information about the script, such as its name, version, and other details.

## Components

### DataBridge Info
- **Purpose**: Provides metadata about the DataBridge library, such as its name, version, author, description, and homepage.

#### Methods:
- `info()`: Returns an object containing metadata about the DataBridge library.

---

### Connection Class
- **Purpose**: Defines a `Connection` class to manage communication channels and facilitate message exchange between scripts.

#### Methods:
- `getChannelName()`: Returns the name of the communication channel.
- `send(message)`: Sends a message through the specified channel.
- `receive(callback)`: Registers a callback function to receive messages on the channel.
- `debugMessageHook(callback)`: Registers a callback function to debug messages without validation.

---

### Protocol
- **Purpose**: Provides utilities to verify message formats, register message types, dispatch events, and handle event listeners.

#### Methods:
- `verifyMessage(message)`: Verifies if a message has a valid header structure.
- `registerMessageType(connection, messageType, callback)`: Registers a callback function for a specific message type.
- `dispatchEvent(connection, eventName, detail, receiver)`: Sends an event message to a specified receiver.
- `registerEvent(connection, eventName, callback)`: Registers a callback function for a specific event name.

---

### defaultProtocol
- **Purpose**: Implements system-related protocols such as PING-PONG mechanisms to maintain communication integrity.
- **Usage**: Automatically added when creating a connection.

### Tools
- **Purpose**: Provides utility functions to perform specific tasks such as checking connectivity between scripts.

#### Methods:
- `PING(connection, receiver)`: Sends a PING message to check connectivity

---

## Usage Examples

### Creating a Connection

```javascript
const connection = new Connection("channelName");
```

### Sending a Message
```javascript
connection.send({
    header: {
        sender: "SenderScript",
        receiver: "ReceiverScript",
        protocolVersion: "1.0",
        messageType: "CREATE-YOUR-OWN-TYPE",
    },
    body: "what-ever-you-want-(every-datatype)",
});
```

### Receiving a Message
```javascript
connection.receive((message) => {
    console.log("Received Message:", message);
});
```
---

# Public Functions

## General Connection Functions

### Connection Class
- **Purpose**: Defines a `Connection` class to manage communication channels and facilitate message exchange between scripts.

#### Methods:
- `getChannelName()`: Returns the name of the communication channel.
- `send(message)`: Sends a message through the specified channel.
- `receive(callback)`: Registers a callback function to receive messages on the channel.
- `debugMessageHook(callback)`: Registers a callback function to debug messages without validation.

---

```js
getChannelName()
```
>
> ### Description
>
> Returns the name of the communication channel.
>
> ### Parameters
>
> None
>
> ### Returns
>
> **(String)** *The Connection Name as an string.*


### send Function

```js
send()
```
>
> ### Description
>
> Sends a message through the specified channel.
>
> ### Parameters
>
> **(Array)** *The Message to send in a JSON like Array*
>
> ### Returns
>
> None


### receive Function

```js
receive()
```
>
> ### Description
>
> Registers a callback function to receive messages on the channel.
>
> ### Parameters
>
> **(Callback)** *The Function to call when a Message is received. The Callback Function is called with the received Message as a parameter.*
>
> ### Returns
>
> None


### receive Function

```js
debugMessageHook()
```
>
> ### Description
>
> Registers a callback function to debug messages. The received Messages are not validated.
>
> ### Parameters
>
> **(Callback)** *The Function to call when a Message is received. The Callback Function is called with the received Message as a parameter.*
>
> ### Returns
>
> None


### Protocol
- **Purpose**: Provides utilities to verify message formats, register message types, dispatch events, and handle event listeners.

#### Methods:
- `verifyMessage(message)`: Verifies if a message has a valid header structure.
- `registerMessageType(connection, messageType, callback)`: Registers a callback function for a specific message type.
- `dispatchEvent(connection, eventName, detail, receiver)`: Sends an event message to a specified receiver.
- `registerEvent(connection, eventName, callback)`: Registers a callback function for a specific event name.

---

### verifyMessage Function

```js
verifyMessage()
```
>
> ### Description
>
> Verifies if a message has a valid header structure.
>
> ### Parameters
>
> **(message)** *The Message to verify*
>
> ### Returns
>
> **(Return)** *Returns true if the message is valid, false otherwise.*



### registerMessageType Function

```js
registerMessageType()
```
>
> ### Description
>
> Registers a message type and sets a callback function to be executed when a message of that type is received.
>
> ### Parameters
>
> **(connection)** *The connection object*
> **(messageType)** *String*
> **(callback)** *The callback function to be executed when a message of the specified type is received.*
>
> ### Returns
>
> None



### dispatchEvent Function

```js
dispatchEvent()
```
>
> ### Description
>
> Dispatches an event with the specified event name and detail to the specified receiver.
>
> ### Parameters
>
> **(connection)** *The connection object*
> **(eventName)** *The name of the event to dispatch.*
> **(detail)** *The detail of the event*
> **(receiver)** *The receiver of the event*
>
> ### Returns
>
> None



### registerEvent Function

```js
registerEvent()
```
>
> ### Description
>
> Registers an event and sets a callback function to be executed when an event with the specified name is received.
>
> ### Parameters
>
> **(connection)** *The connection object*
> **(eventName)** *The name of the event to register*
> **(callback)** *The callback function to be executed when an event with the specified name is received*
>
> ### Returns
>
> None
