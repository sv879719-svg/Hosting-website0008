const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const HOSTING_DIR = path.join(__dirname, '..', 'hosting');
fs.mkdirSync(HOSTING_DIR, { recursive: true });

class HostingManager {
  constructor() {
    this.processes = new Map();
    this.timestamps = new Map();
  }
  async createHosting(userId, name, type, limits) {
    const count = DB.find('hosting', h => h.user === userId).length;
    if (limits && count >= limits.maxServers) throw new Error('Server limit reached');
    const port = await this.getPort();
    const startCmd = type === 'python' ? 'main.py' : (type === 'static' ? '' : 'index.js');
    const acc = DB.insert('hosting', {
      user: userId, name, type, status: 'stopped',
      config: { port, startCommand: startCmd, envVariables: [], autoRestart: true },
      plan: limits, processId: null
    });
    fs.mkdirSync(path.join(HOSTING_DIR, acc._id), { recursive: true });
    return acc;
  }
  async deployProject(hostingId, filePath) {
    const acc = DB.findOne('hosting', h => h._id === hostingId);
    if (!acc) throw new Error('Not found');
    const destDir = path.join(HOSTING_DIR, hostingId);
    if (path.extname(filePath) === '.zip') {
      const unzipper = require('unzipper');
      await fs.createReadStream(filePath).pipe(unzipper.Extract({ path: destDir })).promise();
    } else {
      const dest = path.join(destDir, path.basename(filePath));
      fs.copyFileSync(filePath, dest);
    }
    if (['nodejs','api','telegram-bot'].includes(acc.type) && fs.existsSync(path.join(destDir, 'package.json'))) {
      await this.exec('npm', ['install'], destDir);
    } else if (acc.type === 'python' && fs.existsSync(path.join(destDir, 'requirements.txt'))) {
      await this.exec('pip', ['install', '-r', 'requirements.txt'], destDir);
    }
  }
  exec(cmd, args, cwd) {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { cwd, shell: false, stdio: 'pipe' });
      child.on('close', code => code === 0 ? resolve() : reject(new Error(cmd + ' failed')));
      child.on('error', reject);
    });
  }
  async startServer(hostingId) {
    const acc = DB.findOne('hosting', h => h._id === hostingId);
    if (!acc) throw new Error('Not found');
    const dir = path.join(HOSTING_DIR, hostingId);
    let cmd, args;
    if (acc.type === 'static') { cmd = 'npx'; args = ['serve', '-l', String(acc.config.port)]; }
    else { cmd = acc.type === 'python' ? 'python3' : 'node'; args = [acc.config.startCommand || 'index.js']; }
    const child = spawn(cmd, args, { cwd: dir, env: { ...process.env, PORT: String(acc.config.port) }, shell: false, stdio: 'pipe' });
    this.processes.set(hostingId, child);
    this.timestamps.set(hostingId, Date.now());
    DB.update('hosting', hostingId, { processId: child.pid, status: 'active', lastStarted: new Date().toISOString() });
    child.on('exit', () => {
      this.processes.delete(hostingId);
      const cur = DB.findOne('hosting', h => h._id === hostingId);
      if (cur && cur.config.autoRestart && cur.status === 'active') setTimeout(() => this.startServer(hostingId), 3000);
      else if (cur) DB.update('hosting', hostingId, { processId: null, status: 'stopped' });
    });
  }
  async stopServer(hostingId) {
    const proc = this.processes.get(hostingId);
    if (proc) { proc.kill(); this.processes.delete(hostingId); }
    DB.update('hosting', hostingId, { processId: null, status: 'stopped' });
  }
  async restartServer(hostingId) { await this.stopServer(hostingId); return this.startServer(hostingId); }
  async getPort() { const used = DB.find('hosting').map(h => h.config?.port).filter(Boolean); let p = 3000; while (used.includes(p)) p++; return p; }
}
module.exports = new HostingManager();