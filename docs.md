# DataBridge Library Documentation

## Introduction

DataBridge is a JavaScript library designed to facilitate communication between different scripts or components within a web environment. This documentation provides an overview of the library's features, components, usage guidelines, and examples.

## Table of Contents

1. [Library Overview](#library-overview)
2. [Components](#components)
    - [DataBridge Info](#databridge-info)
    - [Connection Class](#connection-class)
    - [Protocol](#protocol)
    - [SystemProtocol](#systemprotocol)
    - [Tools](#tools)
3. [Usage Examples](#usage-examples)
4. [ToDo List](#todo-list)

## Library Overview

DataBridge aims to simplify communication between different parts of a web application or scripts running in various contexts, such as browser windows, tabs, or frames. It provides a structured approach to send, receive, and manage messages using custom events and protocols.

## Components

### DataBridge Info

- **Purpose**: Provides metadata about the DataBridge library, such as its name, version, author, description, and homepage.

#### Methods:

- `info()`: Returns an object containing metadata about the DataBridge library.

### Connection Class

- **Purpose**: Defines a `Connection` class to manage communication channels and facilitate message exchange between scripts.

#### Methods:

- `getChannelName()`: Returns the name of the communication channel.
- `send(message)`: Sends a message through the specified channel.
- `receive(callback)`: Registers a callback function to receive messages on the channel.
- `debugMessageHook(callback)`: Registers a callback function to debug messages without validation.

### Protocol

- **Purpose**: Provides utilities to verify message formats, register message types, dispatch events, and handle event listeners.

#### Methods:

- `verifyMessage(message)`: Verifies if a message has a valid header structure.
- `registerMessageType(connection, messageType, callback)`: Registers a callback function for a specific message type.
- `dispatchEvent(connection, eventName, detail, receiver)`: Sends an event message to a specified receiver.
- `registerEvent(connection, eventName, callback)`: Registers a callback function for a specific event name.

### SystemProtocol

- **Purpose**: Implements system-related protocols such as PING-PONG mechanisms to maintain communication integrity.

#### Methods:

- `sendJoin(connection)`: Sends a JOIN message to initialize communication.
- `init(connection)`: Initializes system protocols like PING-PONG mechanisms.

### Tools

- **Purpose**: Provides utility functions to perform specific tasks such as checking connectivity between scripts.

#### Methods:

- `PING(connection, receiver, timeout)`: Sends a PING message to check connectivity and receives a PONG response within a specified timeout.

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
