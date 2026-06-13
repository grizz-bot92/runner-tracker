import express , { Router, Request, Response, response } from "express";
import pool from '../db';


const runnerRouter: Router = express.Router();

runnerRouter.get('/', async(req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM runner');
  res.json({ message: 'List of runners', runner: result.rows })
});

runnerRouter.get('/:id', async(req:Request, res:Response) => {
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

runnerRouter.put('/:id', async(req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, bib_number, emergency_contact_name, emergency_contact_number } = req.body;
  const update = await pool.query(
    'UPDATE runner SET name = $1, age = $2, bib_number = $3, emergency_contact_name = $4, emergency_contact_number = $5 WHERE id = $6 RETURNING *',
    [name, age, bib_number, emergency_contact_name, emergency_contact_number, `${id}`]
    );
    res.json({ message: `Runner ${id} updated`, runner: update.rows[0] })
});

runnerRouter.delete('/:id', async(req:Request, res:Response) =>{
  const id = req.params.id;
  const result = await pool.query('DELETE FROM runner WHERE id = $1', [`${id}`])

  res.status(204).end();

})

export default runnerRouter;