export default ({ title, value, icon }) => (
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <div className="flex justify-between">
      <span className="text-2xl">{icon}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <p className="text-gray-400 mt-1">{title}</p>
  </div>
);
