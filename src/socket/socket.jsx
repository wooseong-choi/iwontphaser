import io from "socket.io-client";

// Connect to the server
export var socket = null; // io("ws://localhost:3001");

// Listen for 'connect' event
socket.on("connect", () => {
  console.log("Connected to server");
});

// Listen for 'message' event
socket.on("message", (data) => {
  console.log("Received message:", data);
});

// Send a message to the server
socket.emit("message", "Hello, server!");

// Disconnect from the server
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
