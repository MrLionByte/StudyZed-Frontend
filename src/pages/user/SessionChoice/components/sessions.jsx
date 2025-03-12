import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const sessions = [
  { id: 1, title: 'Mathematics', instructor: 'Farhan', subject: 'Calculus' },
  { id: 2, title: 'Physics', instructor: 'Sarah', subject: 'Mechanics' },
];

export default function Sessions() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Active Sessions</h1>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to={`/dashboard/${session.id}`}
            className="block bg-teal-900/30 p-6 rounded-lg hover:bg-teal-900/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
            <p className="text-gray-300">Instructor: {session.instructor}</p>
            <p className="text-gray-300">Subject: {session.subject}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
