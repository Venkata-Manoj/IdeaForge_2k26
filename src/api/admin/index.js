// Consolidated Admin API Router
// Combines all admin endpoints into a single serverless function

import loginHandler from './login.js';
import statsHandler from './stats.js';
import usernamesHandler from './usernames.js';
import addHandler from './add.js';
import deleteHandler from './delete.js';
import resetHandler from './reset.js';
import updateHandler from './update.js';
import detailsHandler from './details.js';
import downloadCSVHandler from './download-csv.js';
import exportHandler from './export.js';
import exportZipHandler from './export-zip.js';
import uploadHandler from './upload.js';

const handlers = {
  'admin/login': loginHandler,
  'admin/stats': statsHandler,
  'admin/usernames': usernamesHandler,
  'admin/add': addHandler,
  'admin/delete': deleteHandler,
  'admin/reset': resetHandler,
  'admin/update': updateHandler,
  'admin/details': detailsHandler,
  'admin/download-csv': downloadCSVHandler,
  'admin/export': exportHandler,
  'admin/export-zip': exportZipHandler,
  'admin/upload': uploadHandler,
};

export default async function handler(req, res) {
  // Get the path after /api/, stripping any trailing slash
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');

  // Find the matching handler
  const routeHandler = handlers[path];

  if (!routeHandler) {
    return res.status(404).json({ error: 'Admin endpoint not found' });
  }

  // Call the appropriate handler
  return routeHandler(req, res);
}
