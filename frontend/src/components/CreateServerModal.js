import React, { useState } from 'react';
import api from '../services/api';

export default ({ onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('nodejs');

  const submit = async e => {
    e.preventDefault();
    await api.post('/hosting/create', { name, type });
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700">
        <h3 className="text-xl font-bold mb-4">New Server</h3>
        <form onSubmit={submit}>
          <input className="w-full p-3 mb-3 bg-gray-700 rounded text-white" placeholder="Server Name" value={name} onChange={e => setName(e.target.value)} required />
          <select className="w-full p-3 mb-4 bg-gray-700 rounded text-white" value={type} onChange={e => setType(e.target.value)}>
            <option value="nodejs">Node.js</option>
            <option value="python">Python</option>
            <option value="static">Static</option>
            <option value="telegram-bot">Bot</option>
            <option value="api">API</option>
          </select>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Create</button>
            <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
