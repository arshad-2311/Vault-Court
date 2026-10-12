import app from '../../server/server.js';

export default function handler(req, res) {
  const queryStr = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  req.url = `/api/bookings/availability${queryStr}`;
  return app(req, res);
}
