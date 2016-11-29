// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const timeoutduration = 1000;
// Set the port to 4000
// Create a new express server

const PORT = process.env.PORT;

const server = express();
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ process.env.PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (ws) => {

  console.log('Client connected!');

  var intervalId = setInterval(() => {
    console.log('pinging client!');

    if(ws !== undefined) {
          ws.send('{"data": "ping"}');
    }

    }, timeoutduration);

  ws.on('message', data => {

    if((JSON.parse(data)).data === 'pong') {

      console.log('Received pong from client!');

    }else{
      // Broadcast to everyone else.
      wss.clients.forEach(client => {
        if (client !== ws) client.send(data);
      });
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);

  });

});
