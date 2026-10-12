import app from '../../server/server.js';

export default function handler(req, res) {
  req.url = '/api/bookings/create-hold';
  return app(req, res);
}
