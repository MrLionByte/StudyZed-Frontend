import { Clock, Users, Copy, Check, GraduationCap, Calendar, ArrowRight } from 'lucide-react';

const SessionCard = ({ session, copiedId, onCopyCode, onEnterSession }) => {
  const isExpired = session.days_left <= 0;
  const bg_image = session.image || 'https://img.freepik.com/free-photo/back-school-witch-school-supplies_23-2148151036.jpg?w=900';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700 hover:border-emerald-500 transition-all duration-300 shadow-xl bg-slate-800">
      {/* Card Header */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url(${bg_image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isExpired ? (
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
              Expired
            </span>
          ) : !session.is_active ? (
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
              Pending Approval
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          )}
        </div>

        {/* Session Code Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1">
          <span className="bg-slate-700/90 text-emerald-400 px-2 py-1 rounded-md text-xs font-medium">
            {session.session_code}
          </span>
          <button
            onClick={() => onCopyCode(session.session_code)}
            className="p-1 bg-slate-700/90 hover:bg-slate-600/90 rounded-md transition-colors"
            title="Copy session code"
          >
            {copiedId === session.session_code ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>

        {/* Course Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold group-hover:text-emerald-400 transition-colors line-clamp-2">
            {session.session_name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
            <span className={`mr-1 font-bold ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
              {isExpired ? '0' : session.days_left}
            </span>
            <span className="text-sm">Days Left</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
            <span>{session.student_count}</span>
            <span className="text-sm ml-1">Students</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <GraduationCap className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
            <span className="text-sm">{session.category || 'General'}</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
            <span className="text-sm">{session.created_at?.slice(0,10) || 'N/A'}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) =>
            onEnterSession(
              e,
              session.tutor_code,
              session.session_code,
              session.days_left,
              session.is_active
            )
          }
          disabled={isExpired}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isExpired
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : !session.is_active
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {isExpired ? 'Session Expired' : !session.is_active ? 'Awaiting Approval' : 'Enter Session'}
          {!isExpired && session.is_active && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default SessionCard;