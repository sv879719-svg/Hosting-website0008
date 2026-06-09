const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const tables = ['users','hosting','plans','payments','tickets','apikeys'];
tables.forEach(t => {
  const f = path.join(dataDir, t+'.json');
  if (!fs.existsSync(f)) fs.writeFileSync(f, '[]');
});
const plansPath = path.join(dataDir, 'plans.json');
if (JSON.parse(fs.readFileSync(plansPath)).length === 0) {
  fs.writeFileSync(plansPath, JSON.stringify([
    { _id:'free', name:'Free', price:0, limits:{ maxServers:1, ram:64, cpu:0.2, disk:128, bandwidth:1 } },
    { _id:'starter', name:'Starter', price:5, limits:{ maxServers:3, ram:256, cpu:0.5, disk:512, bandwidth:10 } },
    { _id:'pro', name:'Pro', price:15, limits:{ maxServers:10, ram:1024, cpu:2, disk:5120, bandwidth:50 } }
  ]));
}
function read(col) { return JSON.parse(fs.readFileSync(path.join(dataDir, col+'.json'))); }
function write(col, data) { fs.writeFileSync(path.join(dataDir, col+'.json'), JSON.stringify(data,null,2)); }
global.DB = {
  find: (col, pred) => pred ? read(col).filter(pred) : read(col),
  findOne: (col, pred) => DB.find(col, pred)[0] || null,
  insert: (col, doc) => { const all = read(col); const newDoc = { _id: require('uuid').v4(), createdAt: new Date().toISOString(), ...doc }; all.push(newDoc); write(col, all); return newDoc; },
  update: (col, id, upd) => { const all = read(col); const idx = all.findIndex(d => d._id === id); if (idx === -1) return null; all[idx] = { ...all[idx], ...upd, updatedAt: new Date().toISOString() }; write(col, all); return all[idx]; },
  remove: (col, id) => write(col, read(col).filter(d => d._id !== id))
};