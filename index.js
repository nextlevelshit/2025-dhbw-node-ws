import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8081;

const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send a welcome message to the client
    ws.send('Welcome to the real-time app!');

    // Handle messages received from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Echo the received message back to the client
        ws.send(`You said: ${message}`);
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`Real-time app server is running on port ${port}`);
