import express from "express";
import cors from "cors";
import logger from "morgan";
import { createServer } from 'node:http';
import websocketServer from "./websocket.js";
const port = process.env.PORT || 3000;

const app = express();

const server = createServer(app);

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

websocketServer(server);