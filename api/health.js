import app from '../server/server.js';

export default function handler(req, res) {
  req.url = '/api/health';
  return app(req, res);
}
