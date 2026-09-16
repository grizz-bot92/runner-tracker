import request from 'supertest';
import app from '../index';
import dotenv from 'dotenv';
import { response } from 'express';
dotenv.config({ path: '.env' })


describe('POST /runners', () => {
  it('returns 401 with no auth', async() => {
    const response = await request(app)
      .post('/aid_stations')
      .send({ name: 'Name', bib_number: '23', race_id: 1  });
    
      expect(response.status).toBe(401);
  });
});

describe('POST /check_in', () => {
  it('returns 401 with no auth', async() => {
    const response = await request(app)
      .post('/check_in')
      .send({ runner_id: 2344, aid_station_id: 2, checked_in_at: 'time' })
  
      expect(response.status).toBe(401)
    });
});


// describe('POST /login', () => {
//   it('returns 401 with incorrect login', async() => {
//     const response = await request(app)
//       .post('/login')
//       .send({ username: 'wrong', password: 'wrong' })
    
//     expect(response.status).toBe(401)
//   });
// });


// describe('GET /races', () => {
//   it('return 200 with races array', async() => {
//     const response = await request(app)
//       .get('/races')
//     expect(response.status).toBe(200);
//   });
// });


// describe('GET /runners/search/leaderboard', () => {
//   it('return 200 with leaderboard', async() => {
//     const response = await request(app)
//       .get('/runners/search/leaderboard')
//     expect(response.status).toBe(200);
//   });
// });



