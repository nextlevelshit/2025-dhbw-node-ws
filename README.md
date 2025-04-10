# WebSocket Chat Application - DHBW 2025

This is a simple WebSocket-based chat application that demonstrates real-time communication between a server and multiple clients.
This project will help you understand the basics of WebSockets, which allow for two-way communication between web browsers and servers.

## Overview

The project consists of:
1. A Node.js WebSocket server (`index.js`)
2. A simple HTML client interface (`client.html`)
3. Configuration (`package.json`)

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/nextlevelshit/2025-dhbw-node-ws.git
   ```

2. Navigate to the project directory:
   ```
   cd 2025-dhbw-node-ws
   ```

3. Install the dependencies:
   ```
   npm i
   ```

## Running the Application

1. Start the WebSocket server:
   ```
   npm start
   ```
2. The server should start and display: "Real-time app server is running on port 8081"

## Trying It Out

### Method 1: Using the HTML Client
1. Open the `client.html` file in your web browser
2. You should see a simple interface with a message area and a form to send messages
3. Open multiple browser windows with `client.html` to simulate different users

### Method 2: Using Terminal (for testing)
You can connect to the WebSocket server from the terminal with:
```
npm run client
```

## Configuration/Modification Options

You might need to modify the project for your specific environment:

- **Change the port number**: If port 8081 is already in use, you can set a different port when starting the server:
  ```
  PORT=1234 npm run start
  ```
  This will run the server on port 1234 instead of the default 8081.

- **WebSocket server URL**: If you change the port, remember to update the WebSocket connection URL in `client.html`:
  ```javascript
  const socket = new WebSocket('ws://localhost:1234');  // Match the port you used
  ```

## What's Happening

- When a client connects, they receive a welcome message
- All other connected clients are notified when someone joins or leaves
- When a client sends a message, it's broadcast to all connected clients with the sender's ID
- Each client is assigned a unique ID based on the connection timestamp

## Learning Objectives

This project demonstrates:
- Setting up a WebSocket server in Node.js
- Handling WebSocket events (connection, message, close)
- Broadcasting messages to connected clients
- Creating a simple client interface that communicates with a WebSocket server

Try modifying the code to add new features, such as displaying usernames instead of IDs, or adding timestamps to messages!