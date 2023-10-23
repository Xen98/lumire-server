import express from "express";
import cors from "cors";
import logger from "morgan";
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  console.log('Nuevo cliente Conectado');

  ws.send('Bienvenido al websocket');

  ws.on('message', (message) => {
    
    console.log(`mensaje recibido: ${message}`);

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:4321',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}));

app.use(logger("dev"));

app.get("/api", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Hello World" });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});