// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
const request = require('supertest');
const app = require('../../server/server'); 
const server='../../server/server'
describe('POST /api/login', () => {
  it('should respond with a valid token on successful login', async () => {
    // Assuming you have a test user in your database
    const testUser = {
      Email: 'ep',
      Password: 'ep',
    };

    // Mocking the database query to return the test user
    jest.spyOn(server.connection, 'query').mockImplementation((sql, values, callback) => {
      callback(null, [testUser]);
    });

    const response = await request(server)
      .post('/api/login')
      .send({
        email: testUser.Email,
        password: testUser.Password,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.body.username).toBeUndefined(); // Modify this based on your actual response structure
  });

  it('should respond with a 401 status on invalid login', async () => {
    // Mocking the database query to simulate an incorrect login
    jest.spyOn(server.connection, 'query').mockImplementation((sql, values, callback) => {
      callback(null, []); // Empty result set simulates incorrect login
    });

    const response = await request(server)
      .post('/api/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.token).toBeNull();
    expect(response.body.err).toBe('Email or Password is incorrect');
  });
});