import express, { Request, Response, Router} from 'express';
import pool from '../db';
import authenticate from '../middleware/auth';

const aidStationRouter: Router  = express.Router();

aidStationRouter.get('/', async(req:Request, res:Response) =>{
  const result = await pool.query('SELECT * FROM aid_station');
  res.json({ message: 'Aid Stations: ', aid_station: result.rows });
});

aidStationRouter.get('/:id', async(req:Request, res:Response) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM aid_station WHERE id = $1', [`${id}`])

  if(result.rows[0]){
    res.json({ message: "Aid Station: ", aid_station: result.rows[0] });
  }else{
    res.status(404).end("Aid Station not found");
  }
});

aidStationRouter.post('/', authenticate, async(req:Request, res:Response) =>{
  const { name, mile_marker, cutoff_time, crew_access, race_id } = req.body;

  const result = await pool.query(
    'INSERT INTO aid_station (name, mile_marker, cutoff_time, crew_access, race_id) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [name, mile_marker, cutoff_time, crew_access, race_id]);

    res.json({ message: 'Aid Station created', aid_station: result.rows[0] })
});

aidStationRouter.put('/:id', authenticate, async(req:Request, res:Response) => { 
  const id = req.params.id;
  const { name, mile_marker, cutoff_time, crew_access } = req.body;
  const update = await pool.query(
    'UPDATE aid_station SET name = $1, mile_marker = $2, cutoff_time = $3, crew_access = $4 WHERE id = $5 RETURNING *',
    [name, mile_marker, cutoff_time, crew_access, `${id}`]
  );
  
  res.json({ message: 'Aid Station updated', aid_station: update.rows[0] })

});

aidStationRouter.delete('/:id', authenticate, async(req:Request, res:Response) =>{
  const id = req.params.id;
  const result = await pool.query('DELETE FROM aid_station WHERE id = $1', [`${id}`]);
  
  res.json(204).end();

});

export default aidStationRouter;