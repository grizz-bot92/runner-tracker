import jwt from 'jsonwebtoken';
import  bcrypt from 'bcrypt';
import pool from '../db';
import express, { Request, Response, Router } from 'express';

const loginRouter : Router = express.Router();

loginRouter.post('/', async (req:Request, res: Response) => {
  const { username, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  const passwordCorrect = user == null
    ? false
    : await bcrypt.compare(password, user.password);

  if(!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const secret = process.env.SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'missing JWT secret' });
  }

  const token = jwt.sign(userForToken, secret as string, { expiresIn: '24h' });

  res.status(200).send({ token, username: user.username, name: user.name });

});

export default loginRouter;