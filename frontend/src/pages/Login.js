import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const { login } = useAuth(); const nav = useNavigate();
  const submit = async e => { e.preventDefault(); await login(email, pass); nav('/dashboard'); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">Login</h2>
        <input className="w-full p-3 mb-3 bg-gray-700 rounded-lg text-white" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" placeholder="Password" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Sign In</button>
        <p className="mt-4 text-gray-400 text-center">Don't have an account? <Link to="/register" className="text-blue-400">Register</Link></p>
      </form>
    </div>
  );
}