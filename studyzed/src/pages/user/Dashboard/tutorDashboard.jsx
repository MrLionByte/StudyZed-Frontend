import { useEffect, useState } from 'react';
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
import Navbar from '../SessionChoice/components/navbar';
import DashboardMain from './components/dashboardMain';
import Memebers from './components/members'
import { useLocation, useNavigate } from 'react-router-dom';
import { clearSavedAuthData } from '../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ClipboardList, label: 'Assessment', id: 'assessment' },
  { icon: CheckSquare, label: 'Tasks', id: 'tasks' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: School, label: 'My Class', id: 'class' },
  { icon: TrendingUp, label: 'Class Progress', id: 'progress' },
  { icon: Users, label: 'My Students', id: 'members' },
  { icon: UserCircle, label: 'My Account', id: 'account' },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sessionData, setSessionData] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardMain />;
      case 'assessment':
        // return <Profile />; 
      case 'tasks':
        // return <Profile />; 
      case 'messages':
        // return <Profile />; 
      case 'class':
        // return <Profile />; 
      case 'members':
        return <Memebers session_data={sessionData} />; 
      case 'account':
        // return <Profile />; 
      
      default:
        return <div className="text-gray-400">Select a section to view content</div>;
    }
  };

  useEffect(() => {
    if (location.state) {
        setSessionData(location.state);
    }
}, [location.state]);

  const handleLogout = () => {
      dispatch(logout());
      clearSavedAuthData()
      navigate('/login/');
      console.log("wadadasd");
      
  };

  const handleAccounts= () => {
    navigate('/tutor/profile/')
  };

  return (
    <div>
      <Navbar  logout={handleLogout} userProfile={handleAccounts} />
      <div className="flex gap-8 mt-6">
      
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

        
        <div className="flex-1">{renderActiveSection()}</div>
      </div>
    </div>
  );
}