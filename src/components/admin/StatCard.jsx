export const StatCard = ({ title, value, trend, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon size={16} />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-900">{value}</span>
      {trend && <span className="text-[10px] font-bold text-green-500">{trend}</span>}
    </div>
  </div>
);