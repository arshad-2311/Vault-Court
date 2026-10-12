import app from '../../server/server.js';

export default function handler(req, res) {
  req.url = '/api/bookings/confirm-counter';
  return app(req, res);
}
