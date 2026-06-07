import express from 'express';
import dotenv from 'dotenv';
import pool from './db';
import raceRouter from './routes/races';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/races', raceRouter);


app.get('/', (req, res) => {
  res.json({message: 'Runner tracker API'});
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

