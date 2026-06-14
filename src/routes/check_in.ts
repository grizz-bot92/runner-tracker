import express, { Request, Response, Router } from 'express';
import pool from '../db';

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

  res.json({ message: 'Check in created', checked_in: result.rows[0] });

});


export default checkInRouter;