import express from 'express';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import raceRouter from './routes/races';
import runnerRouter from './routes/runners';
import aidStationRouter from './routes/aidStations';
import checkInRouter from './routes/check_in';
import loginRouter from './routes/login';
import authenticate from './middleware/auth';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app  = express();

app.use(express.json());
app.use(cors());
app.use('/races', authenticate, raceRouter);
app.use('/runners', runnerRouter);
app.use('/aid_stations', authenticate, aidStationRouter);
app.use('/check_in', authenticate, checkInRouter);
app.use('/login', loginRouter)

const server = createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.get('/', (req, res) => {
  res.json({message: 'Runner tracker API'});
})


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

