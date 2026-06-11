import express , { Router, Request, Response, response } from "express";
import pool from '../db';


const runnerRouter: Router = express.Router();

runnerRouter.get('/', async(req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM runner');
  res.json({ message: 'List of runners', runner: result.rows })
});

runnerRouter.get('/', async(req:Request, res:Response) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM runner WHERE id = $1', [`${id}`]);

  if(result.rows[0]){
    res.json({ message: 'Runner ID: `${id}` ', runner: result.rows[0] })
  } else {
    res.status(404).end('Runner id not found');
  }
});

runnerRouter.post('/', async(req:Request, res:Response) =>{
  const { name, age, bib_number, emergency_contact_name, emergency_contact_number, race_id} = req.body;
  const result = await pool.query(
    'INSERT INTO runner(name, age, bib_number, emergency_contact_name, emergency_contact_number, race_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, age, bib_number, emergency_contact_name, emergency_contact_number, race_id] 
  );

  res.json({ message: 'Runner Created:', runner: result.rows[0] })
});

runnerRouter.put('/', (req: Request, res: Response) => {
  //pass
});

runnerRouter.delete('/', (req:Request, res:Response) =>{
  //pass
})

export default runnerRouter;