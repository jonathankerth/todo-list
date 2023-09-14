const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let tasks = [];

wss.on("connection", (ws) => {
	console.log("New client connected");

	ws.on("message", (message) => {
		tasks = JSON.parse(message);
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(tasks));
			}
		});
	});

	ws.send(JSON.stringify(tasks));
});

console.log("WebSocket server running on ws://localhost:8080");
