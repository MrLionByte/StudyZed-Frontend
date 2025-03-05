import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  MessageSquare,
  Users,
  TrendingUp,
  UserCircle,
  School,
  Menu,
  X,
} from 'lucide-react';
import Navbar from '../SessionChoice/components/navbar';
import DashboardMain from './students/Main/dashboard';
import Assessment from './students/Assessment/assessment';
import StudentTask from './students/Task/task';
import Messages from './students/Messages/message.jsx';
import MyClass from './students/MyClass/myclass.jsx';
import BatchMembers from './students/BatchMembers/batchMembers.jsx';
import { clearSavedAuthData, getSavedAuthData } from '../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice';
import { saveSessionData, getSessionData } from './components/currentSession';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', component: <DashboardMain /> },
  { icon: ClipboardList, label: 'Assessment', id: 'assessment', component: <Assessment /> },
  { icon: CheckSquare, label: 'Tasks', id: 'tasks', component: <StudentTask /> },
  { icon: MessageSquare, label: 'Messages', id: 'messages', component: <Messages /> },
  { icon: School, label: 'My Class', id: 'class', component: <MyClass /> },
  { icon: TrendingUp, label: 'My Progress', id: 'progress' },
  { icon: Users, label: 'Batch Members', id: 'members', component: <BatchMembers/> },
  { icon: UserCircle, label: 'My Account', id: 'account' },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sessionData, setSessionData] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state) {
      setSessionData(location.state);
      setSessionCode(location.state.sessions.session_code);
      saveSessionData(location?.state);
    }

    if (sessionCode) {
      const session = getSessionData();
      setSessionCode(session);
    }
  }, [location.state]);

  const handleLogout = () => {
    dispatch(logout());
    clearSavedAuthData();
    navigate('/login/');
  };

  const handleAccounts = () => {
    navigate('/student/profile/');
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar logout={handleLogout} userProfile={handleAccounts} />

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="md:hidden p-3 fixed top-2 left-4 z-50 bg-gray-800 
          text-white rounded-md">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1">
        <div className={`fixed md:relative top-0 left-0 h-full bg-gray-900 p-4 transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:w-64 transition-transform duration-300 ease-in-out z-10`}>
          <div className="w-full space-y-2 mt-11 md:mt-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'account') {
                    handleAccounts();
                  } else {
                    setActiveSection(item.id);
                  }
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-emerald-500 text-white' : 'hover:bg-teal-900/30 text-gray-300'}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-3">
          {menuItems.find((item) => item.id === activeSection)?.component || <div>Select a section to view content</div>}
        </div>
      </div>
    </div>
  );
}
