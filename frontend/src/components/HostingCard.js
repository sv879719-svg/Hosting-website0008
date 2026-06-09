export default ({ server, onStart, onStop, onRestart, onDelete, onClick }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 cursor-pointer hover:border-blue-500 transition" onClick={onClick}>
    <h3 className="text-xl font-bold text-white">{server.name}</h3>
    <p className="text-gray-400">{server.type} · {server.status}</p>
    <div className="flex gap-2 mt-4">
      {server.status !== 'active' ? <button onClick={e => {e.stopPropagation(); onStart();}} className="bg-green-600 px-3 py-1 rounded text-sm">Start</button> :
      <button onClick={e => {e.stopPropagation(); onStop();}} className="bg-red-600 px-3 py-1 rounded text-sm">Stop</button>}
      <button onClick={e => {e.stopPropagation(); onRestart();}} className="bg-yellow-600 px-3 py-1 rounded text-sm">Restart</button>
      <button onClick={e => {e.stopPropagation(); onDelete();}} className="bg-gray-600 px-3 py-1 rounded text-sm">Delete</button>
    </div>
  </div>
);
