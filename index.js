import {WebSocketServer} from "ws";
const wss = new WebSocketServer({
	port: 8080
});

wss.on("connection", (ws) => {
	ws.id = Date.now();

	console.log(`Client connected ${ws.id}`);

	// Send a welcome message to the client
	ws.send("Welcome to the real-time app!");

	wss.clients.forEach(client => {
		if (client.id !== ws.id && client.readyState === WebSocket.OPEN) {
			client.send(`${client.id} has joined the chat`);
		}
	});

	// Handle messages received from the client
	ws.on("message", (message) => {
		console.log(`Received message from ${ws.id}: ${message}`);

		// Send message to other clients
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(`${client.id}: ${message}`);
			}
		});
	});

	// Handle disconnection
	ws.on("close", () => {
		console.log("Client disconnected");

		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(`${client.id} has left the chat`);
			}
		});
	});
});

console.log(`Real-time app server is running on port ${port}`);
