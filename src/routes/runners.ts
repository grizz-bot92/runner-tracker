import express , { Router, Request, Response, response } from "express";
import pool from '../db';


const runnerRouter: Router = express.Router();

runnerRouter.get('/', async(req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM runner');
  res.json({ message: 'List of runners', runner: result.rows })
});

runnerRouter.get('/search', async(req:Request, res:Response) => {
  const bib_number  = req.query.bib_number;
  const name = req.query.name;
  
  if(name){
    const result = await pool.query(`SELECT r.name AS runner_name, r.bib_number, r.status, c.checked_in_at, a.mile_marker, a.name AS aid_station 
    FROM runner r
    LEFT JOIN check_in c ON r.id = c.runner_id
    LEFT JOIN aid_station a ON a.id = c.aid_station_id 
    WHERE r.name ILIKE $1
    ORDER BY c.checked_in_at ASC`, [`%${name}%`]);

    res.json({ message: 'runner update', runner: result.rows });
  
  } else if(bib_number){
    const result = await pool.query(`SELECT r.name AS runner_name, r.bib_number, r.status, c.checked_in_at, a.mile_marker, a.name AS aid_station 
    FROM runner r
    LEFT JOIN check_in c ON r.id = c.runner_id
    LEFT JOIN aid_station a ON a.id = c.aid_station_id 
    WHERE r.bib_number = $1
    ORDER BY c.checked_in_at ASC`, [`${bib_number}`] );

    res.json({ message: 'runner update', runner: result.rows });
    
  } else {
    return res.status(404).send('No runner found')
  }

});

runnerRouter.get('/search/leaderboard', async(req:Request, res:Response) =>{
  const result = await pool.query(
  `SELECT * FROM (
    SELECT DISTINCT ON (r.id) r.name AS runner_name, r.bib_number, r.status, a.mile_marker, a.name AS aid_station, c.checked_in_at
    FROM runner r LEFT JOIN check_in c ON r.id = c.runner_id
    LEFT JOIN aid_station a ON a.id = c.aid_station_id
    ORDER BY r.id, a.mile_marker DESC NULLS LAST
  ) AS Leaderboard ORDER BY mile_marker DESC NULLS LAST`);

    res.json({ message: 'runner update', runner: result.rows });
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
  const { name, age, bib_number, emergency_contact_name, emergency_contact_number, status, race_id} = req.body;
  const result = await pool.query(
    'INSERT INTO runner(name, age, bib_number, emergency_contact_name, emergency_contact_number, status, race_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [name, age, bib_number, emergency_contact_name, emergency_contact_number, status, race_id] 
  );

  res.json({ message: 'Runner Created:', runner: result.rows[0] })
});

runnerRouter.put('/:id', async(req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, bib_number, emergency_contact_name, emergency_contact_number, status } = req.body;
  const update = await pool.query(
    'UPDATE runner SET name = $1, age = $2, bib_number = $3, emergency_contact_name = $4, emergency_contact_number = $5, status = $6 WHERE id = $7 RETURNING *',
    [name, age, bib_number, emergency_contact_name, emergency_contact_number, status, `${id}`]
    );
    res.json({ message: `Runner ${id} updated`, runner: update.rows[0] })
});

runnerRouter.patch('/status', async (req: Request, res: Response) => {
  const { bib_number, status} = req.body;
  const update = await pool.query(
    'UPDATE runner SET status = $1 WHERE bib_number = $2 RETURNING *',
    [status, bib_number]
  );

  res.json( { message: `Runner updated`, runner: update.rows[0] } )
});

runnerRouter.delete('/:id', async(req:Request, res:Response) =>{
  const id = req.params.id;
  const result = await pool.query('DELETE FROM runner WHERE id = $1', [`${id}`])

  res.status(204).end()

})

export default runnerRouter;



