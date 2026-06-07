import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function verifyConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('Connected to postgreSQL');
    client.release();
  } catch(error) {
    console.log('Error connecting to DB: ', error)
  }
}

console.log("Attempting to connect....");
verifyConnection();

export default pool;

