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
import DashboardMain from './students/Main/dashboard';
import Assessment from './students/Assessment/assessment';
import { clearSavedAuthData } from '../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice';
import {saveSessionData, getSessionData} from "./components/currentSession";
import { useLocation, useNavigate } from 'react-router-dom';

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

export default function Dashboard({}) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const [sessionData, setSessionData] = useState('');
  const [sessionCode, setSessionCode] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); 

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    clearSavedAuthData()
    navigate('/login/');
    console.log("wadadasd");
    
};

const handleAccounts= () => {
  navigate('/student/student-profile/')
};
  const renderActiveSection = () => {
      switch (activeSection) {
        case 'dashboard':
          return <DashboardMain />;
        case 'assessment':
          return <Assessment />; 
        case 'tasks':
          // return <Profile />; 
        case 'messages':
          return //<Messaging session_data={sessionData}/>;
        case 'class':
          // return <Profile />; 
        case 'members':
          return //<Members session_data={sessionData} />; 
        case 'account':
          // return <Profile />; 
        
        default:
          return <div className="text-gray-400">Select a section to view content</div>;
      }
    };

    useEffect(() => {
        if (location.state) {
          console.log(location.state);
          
            setSessionData(location.state);
            setSessionCode(location.state.sessions.session_code)
            saveSessionData(location?.state)
        }
    
        if (sessionCode) {
          const session = getSessionData();
          setSessionCode(session)
        }
        }, [location.state]);

  return (
    <div className=''>
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

      <div className="flex-1">
        {renderActiveSection()}
      </div>
    </div>
    </div>
  );
}