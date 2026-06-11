import express, { Router, Request, Response } from 'express';
import pool from '../db';

const  raceRouter: Router = express.Router();

raceRouter.get('/', async (req: Request, res: Response) => {
  const result =  await pool.query('SELECT * FROM race')
  res.json({ message: 'List of races: ', race: result.rows });
});

raceRouter.get('/:id', async(req: Request, res: Response) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM race WHERE id = $1', [`${id}`])

  if(result.rows[0]){
    res.json({ message: `Race ID  : ${id}`, races: result.rows[0] });
  } else {
    res.status(404).send('Race Id not found');
  }

});


raceRouter.post('/', async (req: Request, res: Response) => {
  const { name, date, distance, elevation_gain, cutoff_time } = req.body;
  const result = await pool.query(
    'INSERT INTO race(name, date, distance, elevation_gain, cutoff_time) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [name, date, distance, elevation_gain, cutoff_time]
  );

  res.json({ message: 'Race created', race: result.rows[0] });
});

raceRouter.put('/:id', async(req:Request, res:Response) =>{
  const id = req.params.id;
  const { name, date, distance, elevation_gain, cutoff_time} = req.body;

  const update = await pool.query(
    'UPDATE race SET name=$1, date=$2, distance=$3, elevation_gain=$4, cutoff_time=$5 WHERE id = $6 RETURNING *',
    [name, date, distance, elevation_gain, cutoff_time, `${id}`]
  )
  
  res.json({ message: `Race ${id} updated`, race: update.rows[0] });
});


raceRouter.delete('/:id', async(req:Request, res:Response) =>{
  const id = req.params.id;
  const result = await pool.query('DELETE FROM race WHERE id = $1', [`${id}`]);
  res.status(204).end();
});

export default raceRouter;