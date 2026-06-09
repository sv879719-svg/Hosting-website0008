import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HostingCard from '../components/HostingCard';
import StatsCard from '../components/StatsCard';
import CreateServerModal from '../components/CreateServerModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [servers, setServers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    try { const res = await api.get('/hosting/list'); setServers(res.data); } catch {}
  };
  useEffect(() => { load(); }, []);

  const start = async id => { await api.post('/hosting/start/' + id); load(); };
  const stop = async id => { await api.post('/hosting/stop/' + id); load(); };
  const restart = async id => { await api.post('/hosting/restart/' + id); load(); };
  const del = async id => { await api.delete('/hosting/delete/' + id); load(); };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">💰 ${user?.balance || 0}</span>
          {user?.role === 'admin' && <button onClick={() => nav('/admin')} className="bg-yellow-600 px-4 py-2 rounded-lg">Admin</button>}
          <button onClick={() => { logout(); nav('/login'); }} className="bg-red-600 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard title="Servers" value={servers.length} icon="🖥️" />
        <StatsCard title="Active" value={servers.filter(s=>s.status==='active').length} icon="🚀" />
      </div>
      <button onClick={() => setShowCreate(true)} className="bg-blue-600 px-6 py-3 rounded-lg mb-6">+ Create Server</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map(s => (
          <HostingCard key={s._id} server={s} onStart={()=>start(s._id)} onStop={()=>stop(s._id)} onRestart={()=>restart(s._id)} onDelete={()=>del(s._id)} onClick={()=>nav('/server/'+s._id)} />
        ))}
      </div>
      {showCreate && <CreateServerModal onClose={()=>setShowCreate(false)} onCreated={()=>{setShowCreate(false); load();}} />}
    </div>
  );
}
