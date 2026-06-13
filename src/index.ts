import express from 'express';
import dotenv from 'dotenv';
import pool from './db';
import raceRouter from './routes/races';
import runnerRouter from './routes/runners';
import aidStationRouter from './routes/aidStations';
import checkInRouter from './routes/check_in';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/races', raceRouter);
app.use('/runners', runnerRouter);
app.use('/aid_stations', aidStationRouter);
app.use('/check_in', checkInRouter);

app.get('/', (req, res) => {
  res.json({message: 'Runner tracker API'});
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

