/* eslint-disable no-undef */

const WebSocket = require('ws');
let counter = 0;
const server = new WebSocket.Server({ port: 3000 });
server.on('connection', (ws) => {
  counter++;
  ws.send(JSON.stringify({ type: 'newID', id: counter }));
  ws.on('message', (message) => {
    server.clients.forEach((client) => {
      if (server != client && client.readyState == WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
