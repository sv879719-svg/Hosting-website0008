import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ServerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [server, setServer] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get('/hosting/list').then(res => setServer(res.data.find(s=>s._id===id)));
  }, [id]);

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/hosting/upload/' + id, formData);
    alert('Uploaded!');
    setFile(null);
  };

  if (!server) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <button onClick={() => nav('/dashboard')} className="text-blue-400 mb-4">&larr; Back</button>
      <h1 className="text-3xl font-bold text-white">{server.name}</h1>
      <p className="text-gray-400">Type: {server.type} · Status: {server.status} · Port: {server.config.port}</p>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Upload File</h3>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-3 text-white" />
        <button onClick={upload} className="bg-blue-600 px-4 py-2 rounded">Deploy</button>
      </div>
    </div>
  );
}
