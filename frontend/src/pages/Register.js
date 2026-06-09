import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUser] = useState(''); const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const { register } = useAuth(); const nav = useNavigate();
  const submit = async e => { e.preventDefault(); await register(username, email, pass); nav('/dashboard'); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">Register</h2>
        <input className="w-full p-3 mb-3 bg-gray-700 rounded-lg text-white" placeholder="Username" onChange={e => setUser(e.target.value)} />
        <input className="w-full p-3 mb-3 bg-gray-700 rounded-lg text-white" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" placeholder="Password" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Create Account</button>
        <p className="mt-4 text-gray-400 text-center">Already registered? <Link to="/login" className="text-blue-400">Login</Link></p>
      </form>
    </div>
  );
}