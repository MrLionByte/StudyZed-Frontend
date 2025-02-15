import { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  MessageSquare,
  Users,
  TrendingUp,
  UserCircle,
  School
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ClipboardList, label: 'Assessment', id: 'assessment' },
  { icon: CheckSquare, label: 'Tasks', id: 'tasks' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: School, label: 'My Class', id: 'class' },
  { icon: TrendingUp, label: 'My Progress', id: 'progress' },
  { icon: Users, label: 'Batch Members', id: 'members' },
  { icon: UserCircle, label: 'My Account', id: 'account' },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex gap-8">
  
      <div className="w-64 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-emerald-500 text-white'
                : 'hover:bg-teal-900/30 text-gray-300'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

    
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-teal-900/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">Pending Tasks</h2>
            <div className="space-y-4">
             
            </div>
          </div>

         
          <div className="bg-teal-900/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">Leaderboard</h2>
            <div className="space-y-3">
              {[
                { name: 'Davvid Villa', score: 400 },
                { name: 'Mahesh PN', score: 355 },
                { name: 'Fernando Torres', score: 300 },
              ].map((user, index) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between bg-teal-900/50 p-3 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-400">#{index + 1}</span>
                    <span>{user.name}</span>
                  </div>
                  <span className="font-semibold">{user.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}