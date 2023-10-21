import express from "express";
import cors from "cors";
import logger from "morgan";
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321',
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('message', (msg) => {
    console.log('message: ' + msg.message);
  })
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

// Mandar JSON
app.get("/api", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Hello World" });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
