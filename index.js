import express from "express";
import cors from "cors";
import logger from "morgan";
import WebSocket from 'ws';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();

const server = createServer(app);

const wss = WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
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