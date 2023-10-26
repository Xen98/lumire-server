import { WebSocketServer } from 'ws';

export default async (expressServer) => {
  const websocketServer = new WebSocketServer({
    noServer: true,
    path: "/ws",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    //console.log("me siento como messi");
    //console.log(request);
    //console.log(socket);
    //console.log(head);
    //const peroElEstaConAdidasYYoConNaiki = websocketServer.shouldHandle(request);
    ///console.log(peroElEstaConAdidasYYoConNaiki);
    websocketServer.on("wsClientError", (error, socket, request) => {
      console.log(error);
    });
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      //console.log("cristiano ronaldoooooooooo");
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on('connection', (ws) => {
    ws.on('error', console.error);
  
    //console.log('Nuevo cliente Conectado');
  
    ws.on('message', (message) => {
      
      const data = JSON.parse(message);

      console.log(`mensaje recibido: ${data.pwm}`);

      ws.send(message);
  
      websocketServer.clients.forEach(client => {
        if (client !== ws && client.readyState === websocketServer.OPEN) {
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
