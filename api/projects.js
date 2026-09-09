const projects = globalThis.bidvidProjects || (globalThis.bidvidProjects = []);

function finishProcessing(project) {
  if (project.status === 'processing' && Date.now() - new Date(project.createdAt).getTime() >= 3000) project.status = 'ready';
  return project;
}

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const owner = req.query.owner;
    if (!owner || typeof owner !== 'string' || owner.length > 80) return res.status(400).json({ error: 'A valid owner is required.' });
    const visible = projects.filter(project => project.owner === owner).map(finishProcessing).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return res.status(200).json({ projects: visible });
  }
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { owner, prompt, ratio } = body;
    if (typeof owner !== 'string' || owner.length < 8 || owner.length > 80 || typeof prompt !== 'string' || !prompt.trim() || prompt.trim().length > 350) return res.status(400).json({ error: 'Please provide a valid video prompt.' });
    const project = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, owner, prompt: prompt.trim(), ratio: ['16:9', '9:16', '1:1'].includes(ratio) ? ratio : '16:9', status: 'processing', createdAt: new Date().toISOString() };
    projects.push(project);
    return res.status(201).json({ project });
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
};

