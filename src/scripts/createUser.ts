import bcrypt from 'bcrypt';
import pool from '../db';

async function createUser(username: string, password: string, role: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
    [username, hashedPassword, role]
  );

  console.log('user created:', result.rows[0]);
  process.exit(0);
}
