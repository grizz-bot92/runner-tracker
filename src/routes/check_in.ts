import express, { Request, Response, Router } from 'express';
import pool from '../db';
import { io } from '..';

const checkInRouter: Router = express.Router();

checkInRouter.get('/', async(req:Request, res:Response) =>{
  const result = await pool.query('SELECT * FROM check_in');
  res.json({ message: 'Checked in runners', checked_in: result.rows });
})

checkInRouter.get('/:id', async(req:Request, res:Response) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM check_in WHERE id = $1 ', [`${id}`]);

  if(result.rows[0]){
    res.json({ message: 'Checked in runner id', checked_in: result.rows[0] });
  }else{
    res.status(404).end();
  }
});

checkInRouter.post('/', async(req:Request, res:Response) => {
  const { bib_number, aid_station_id, checked_in_at } = req.body;
  const runner = await pool.query('SELECT id FROM runner WHERE bib_number = $1', [bib_number]);
  const runner_id = runner.rows[0].id;

  const result = await pool.query(
    'INSERT INTO check_in(runner_id, aid_station_id, checked_in_at) VALUES($1,$2,$3) RETURNING *',
    [runner_id, aid_station_id, checked_in_at]
  );

  const displayRunner = await pool.query(`
    SELECT r.name AS runner_name, a.name AS aid_station_name, c.checked_in_at
    FROM runner r
    LEFT JOIN check_in c ON r.id = c.runner_id
    LEFT JOIN aid_station a ON a.id = c.aid_station_id
    WHERE r.id = $1 AND a.id = $2
    `, [`${runner_id}`, `${aid_station_id}`]);

  
  console.log("RAW FROM DB:", result.rows[0].checked_in_at);
  
  const payLoad = { message: 'Check in created', checked_in: result.rows[0], displayRunner: displayRunner.rows[0] };
  io.emit('checkin', payLoad);
  res.json(payLoad);
});


export default checkInRouter;