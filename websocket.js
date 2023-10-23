import { WebSocketServer } from 'ws';

export default async (expressServer) => {
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: "/ws",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on('connection', (ws) => {
    ws.on('error', console.error);
  
    console.log('Nuevo cliente Conectado');
  
    ws.send('Bienvenido al websocket');
  
    ws.on('message', (message) => {
      
      console.log(`mensaje recibido: ${message}`);
  
      websocketServer.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
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
