import {WebSocketServer} from "ws";
import axios from "axios";
import {convertTimeToYear} from "./src/helpers/convertTimeToYear.js";
import {formatTimeToHumanReadable} from "./src/helpers/formatTimeToHumanReadable.js";
import {WikipediaApiClient} from "./src/services/WikipediaApiClient.js";
import {wikipediaApiBaseUrl} from "./src/config/constants.js";

const wss = new WebSocketServer({port: 8080});

wss.on("connection", (ws) => {
	ws.id = Date.now();

	console.log(`Client connected ${ws.id}`);

	// Send a welcome message to the client
	ws.send(JSON.stringify({
		type: "connect",
		message: "Welcome to the real world!",
		whoami: ws.id,
		clients: Array.from(wss.clients).map(client => client.id)
	}));

	// Handle messages received from the client
	ws.on("message", (message) => {
		console.log(`Received message from ${ws.id}: ${message}`);

		// Send message to other clients
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({
					type: "message", client: client.id, message: message.toString()
				}));
			}
		});
	});

	ws.on("message", async (message) => {
		const command = message.toString().trim();

		// Ignore non-command messages
		if (!command.startsWith("/")) return;

		// Handle the /time command
		switch (command) {
			case "/time":
				try {
					const response = await handleTimeCommand();
					ws.send(JSON.stringify(response));
				} catch (error) {
					console.error("Error processing /time command:", error);
					ws.send(JSON.stringify({
						type: "error", message: "Failed to process /time command"
					}));
				}
				break;
			case "/clients":
				// Send the list of connected clients
				ws.send(JSON.stringify({
					type: "command", command, clients: Array.from(wss.clients).map(client => client.id)
				}));
				break;
			case "/kick":
				// Kick random client
				const clientsArray = Array.from(wss.clients);
				const randomClient = clientsArray[Math.floor(Math.random() * clientsArray.length)];
				if (randomClient && randomClient.readyState === WebSocket.OPEN) {
					randomClient.send(JSON.stringify({
						type: "kick", message: "You have been kicked from the server."
					}));
					// Close the connection
					randomClient.close();
					// Inform other clients
					wss.clients.forEach(client => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(JSON.stringify({
								type: "kick", client: randomClient.id, message: "A client has been kicked."
							}));
						}
					});
				}
				break;
			default:
				// Send a default message if the command is not recognized
				ws.send(JSON.stringify({
					type: "error", command, message: "Unknown command"
				}));
		}
	});

	// Handle disconnection
	ws.on("close", () => {
		console.log("Client disconnected");

		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({
					type: "disconnect", client: ws.id, message: "A client has disconnected."
				}));
			}
		});
	});
});

/**
 * Handles the /time command
 * @returns {Object} - Response object with time and Wikipedia info
 */
export async function handleTimeCommand() {
	// Instantiate Wikipedia API client
	const wikipediaApi = new WikipediaApiClient({
		httpClient: axios, baseUrl: wikipediaApiBaseUrl
	});
	// Get current time
	const now = new Date();
	const currentTime = formatTimeToHumanReadable(now);
	const timeAsYear = convertTimeToYear(now);

	// Get Wikipedia content for that year
	const wikiContent = await wikipediaApi.getYearInfo(timeAsYear);

	// Create formatted response
	return {
		type: "command", command: "/time", currentTime: currentTime, timeAsYear: timeAsYear, wikiContent: wikiContent
	};
}
