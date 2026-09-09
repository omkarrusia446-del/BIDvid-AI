const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname, dataDirectory = path.join(root, 'data'), dataFile = path.join(dataDirectory, 'projects.json');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8' };
if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
function readProjects() { try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return []; } }
function saveProjects(projects) { fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2), 'utf8'); }
function send(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise((resolve, reject) => { let body = ''; req.on('data', part => { body += part; if (body.length > 10000) { reject(new Error('Request too large')); req.destroy(); } }); req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } }); req.on('error', reject); }); }
http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');
  if (requestUrl.pathname === '/api/health') return send(res, 200, { ok: true, mode: 'demo' });
  if (requestUrl.pathname === '/api/projects' && req.method === 'GET') {
    const owner = requestUrl.searchParams.get('owner');
    if (!owner || owner.length > 80) return send(res, 400, { error: 'A valid owner is required.' });
    return send(res, 200, { projects: readProjects().filter(project => project.owner === owner).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  }
  if (requestUrl.pathname === '/api/projects' && req.method === 'POST') {
    try {
      const { owner, prompt, ratio } = await readBody(req);
      if (typeof owner !== 'string' || owner.length < 8 || owner.length > 80 || typeof prompt !== 'string' || !prompt.trim() || prompt.trim().length > 350) return send(res, 400, { error: 'Please provide a valid video prompt.' });
      const project = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, owner, prompt: prompt.trim(), ratio: ['16:9', '9:16', '1:1'].includes(ratio) ? ratio : '16:9', status: 'processing', createdAt: new Date().toISOString() };
      const projects = readProjects(); projects.push(project); saveProjects(projects);
      setTimeout(() => { const current = readProjects(), target = current.find(item => item.id === project.id); if (target) { target.status = 'ready'; saveProjects(current); } }, 3000);
      return send(res, 201, { project });
    } catch (error) { return send(res, 400, { error: error.message || 'Could not create project.' }); }
  }
  if (req.method !== 'GET') return send(res, 404, { error: 'Not found.' });
  const relative = requestUrl.pathname === '/' ? 'index.html' : decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log(`BIDvid AI running at http://localhost:${process.env.PORT || 3000}`));

