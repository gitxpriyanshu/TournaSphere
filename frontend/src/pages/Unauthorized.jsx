import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <h1 className="text-8xl font-black text-orange-500 tracking-tighter drop-shadow-md">403</h1>
      <h2 className="text-3xl font-bold text-slate-100">Access Denied</h2>
      <p className="text-slate-400 max-w-md font-medium text-lg leading-relaxed">
        You don't have the necessary administrative or structural permissions required to view this sector.
      </p>
      <Link to="/tournaments" className="mt-8 px-8 py-3 bg-slate-800 border-2 border-slate-700 text-orange-400 font-bold rounded-xl hover:bg-slate-700 hover:border-orange-500/50 shadow-lg transition-all focus:ring-4 focus:ring-orange-500/20 outline-none">
        Return to Tournaments
      </Link>
    </div>
  );
};

export default Unauthorized;
