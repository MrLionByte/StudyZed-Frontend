import { GraduationCap, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const SessionCard = ({ session, onEnterSession, isPending }) => {
  const defaultImage = "https://img.freepik.com/free-photo/back-school-witch-school-supplies_23-2148151036.jpg?t=st=1738668597~exp=1738672197~hmac=103229c509cd3cf9de122633137ff9fd612fa133f5bee4e8335c820b73e856ca&w=900";

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="relative group rounded-xl border border-slate-700 overflow-hidden h-64 hover:transform hover:scale-105 hover:border-emerald-500 transition-all duration-300 shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${session.image || defaultImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40 group-hover:via-black/60" />

      <div className="relative p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-medium px-2 py-1 bg-slate-800/80 rounded-md">
              {session.session || session.session_code}
            </span>
          </div>
          {isPending ? (
            <span className="flex items-center text-yellow-500 text-xs bg-yellow-500/20 px-2 py-1 rounded-md">
              <AlertCircle size={14} className="mr-1" />
              Pending
            </span>
          ) : (
            <span className="flex items-center text-emerald-500 text-xs bg-emerald-500/20 px-2 py-1 rounded-md">
              <CheckCircle size={14} className="mr-1" />
              Active
            </span>
          )}
        </div>

        <h3 className="text-white text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {session.session_name || `Session ${session.session || session.session_code}`}
        </h3>

        <div className="mt-2 mb-auto">
          <div className="flex items-center text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-sm truncate">Tutor: {session.tutor_code}</span>
          </div>
          <div className="flex items-center text-gray-300 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-sm">Joined: {formatDate(session.joined_on)}</span>
          </div>
          {session.updated_on && session.updated_on !== session.joined_on && (
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-emerald-400" />
              <span className="text-sm">Updated: {formatDate(session.updated_on)}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onEnterSession(session.tutor_code, session.session || session.session_code, session.is_allowded)}
          className={`w-full mt-4 font-semibold py-2 px-4 rounded-lg transition-colors ${
            isPending
              ? 'bg-slate-600 hover:bg-slate-700 text-white cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
          disabled={isPending}
        >
          {isPending ? 'Awaiting Approval' : 'Enter Session'}
        </button>
      </div>
    </div>
  );
};

export default SessionCard;