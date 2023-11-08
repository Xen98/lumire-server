import { WebSocketServer } from 'ws';

export default async (expressServer) => {
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: "/ws",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.on("wsClientError", (error, socket, request) => {
      console.log(error);
    });
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      console.log(`mensaje recibido: ${message}`);

      ws.send(message);
  
      websocketServer.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(message);
        }
      });
    });
  
    ws.on('close', () => {
      console.log('client disconnected');
    });
  });

  return websocketServer;
};
