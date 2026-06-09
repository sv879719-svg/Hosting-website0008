import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl"><p className="text-gray-400">Users</p><p className="text-2xl">{stats.users}</p></div>
        <div className="bg-gray-800 p-4 rounded-xl"><p className="text-gray-400">Servers</p><p className="text-2xl">{stats.servers}</p></div>
        <div className="bg-gray-800 p-4 rounded-xl"><p className="text-gray-400">Active</p><p className="text-2xl">{stats.active}</p></div>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl">
        <h3 className="text-xl font-bold mb-4">All Users</h3>
        <table className="w-full text-left">
          <thead><tr><th>Username</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-gray-700">
                <td className="py-2">{u.username}</td><td>{u.email}</td><td>{u.status}</td>
                <td>
                  {u.status === 'active' ? <button onClick={() => api.post('/admin/ban/'+u._id).then(()=>window.location.reload())} className="bg-red-600 px-2 py-1 rounded text-sm">Ban</button> :
                  <button onClick={() => api.post('/admin/unban/'+u._id).then(()=>window.location.reload())} className="bg-green-600 px-2 py-1 rounded text-sm">Unban</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
