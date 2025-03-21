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
  Library,
  Settings2,
} from 'lucide-react';
import Navbar from '../SessionChoice/components/navbar';
import DashboardMain from './students/Main/dashboard';
import Assessment from './students/Assessment/assessment';
import StudentTask from './students/Task/task';
import Messages from './students/Messages/message.jsx';
import MyClass from './students/MyClass/myclass.jsx';
import StudyMaterial from './students/StudyMaterial/studyMaterial.jsx';
import BatchMembers from './students/BatchMembers/batchMembers.jsx';
import MyProgress from './students/MyProgress/myProgress.jsx';
import Settings from './students/Settings/settings.jsx';
import {
  clearSavedAuthData,
  getSavedAuthData,
} from '../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice';
import { saveSessionData, getSessionData } from './components/currentSession';
import { saveStudentsDataToSession } from './components/studentsInSession.js';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { API_BASE_URLS } from '../../../api/axios_api_call.js';
import { useFont } from '../../../context/FontContext.jsx';
import { useTheme } from '../../../context/ThemeContext.jsx';
import { useSideBarColor } from '../../../context/SideBarColorContext.jsx';
import { useNavBarColor } from '../../../context/NavbarColorContext.jsx';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    id: 'dashboard',
    component: <DashboardMain />,
  },
  {
    icon: ClipboardList,
    label: 'Assessment',
    id: 'assessment',
    component: <Assessment />,
  },
  {
    icon: CheckSquare,
    label: 'Tasks',
    id: 'tasks',
    component: <StudentTask />,
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    id: 'messages',
    component: <Messages />,
  },
  { icon: School, label: 'My Class', id: 'class', component: <MyClass /> },
  {
    icon: Library,
    label: 'Study Materials',
    id: 'materials',
    component: <StudyMaterial />,
  },
  {
    icon: TrendingUp,
    label: 'My Progress',
    id: 'progress',
    component: <MyProgress />,
  },
  {
    icon: Users,
    label: 'Batch Members',
    id: 'members',
    component: <BatchMembers />,
  },
  { icon: Settings2, 
    label: 'Settings', 
    id: 'settings',
    component: <Settings /> 
  }
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem('activeSection') || 'dashboard'
  );
  const [sessionData, setSessionData] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const { fontSettings, fontClasses } = useFont();
  const { theme } = useTheme();
  const { sideBarColor } = useSideBarColor();


  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getAllStudentsInSession = async () => {
    try {
      const session = getSessionData();
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get('session-student/batch-mates/', {
        baseURL: url,
        params: {
          session_code:
            session?.sessions?.session_code ||
            location.state.sessions.session_code,
        },
      });
      console.log(response);
      const studentCodes = response.data;
      const studentDetails = await api.post(
        'class-app/all-batch-mates-details/',
        studentCodes,
      );
      console.log(studentDetails.data);
      saveStudentsDataToSession(studentDetails.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

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

  useEffect(() => {
    if (fetchFromBackend) {
      getAllStudentsInSession();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const handleLogout = () => {
    dispatch(logout());
    clearSavedAuthData();
    navigate('/login/');
  };

  const handleAccounts = () => {
    navigate('/student/profile/');
  };
  
  return (
    <div className={`h-screen flex flex-col ${theme === 'light' ? 'bg-[#2f7062]' : 'bg-[#102020] text-white'} ${fontClasses[fontSettings.fontStyle] || 'font-sans'}`}>

      <Navbar />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden p-3 fixed top-2 left-4 z-50 bg-gray-800 
          text-white rounded-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1">
        <div
          className={`fixed md:relative top-0 left-0 h-full p-4 transform 
            md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:w-64 
            transition-transform duration-300 ease-in-out z-10`}
            style={{ backgroundColor: sideBarColor }}
        >
          <div className="w-full space-y-2 mt-11 md:mt-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors 
                  ${activeSection === item.id ? 'bg-emerald-500 text-white' : 'hover:bg-teal-900/30 text-gray-300'}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-3">
          {menuItems.find((item) => item.id === activeSection)?.component || (
            <div>Select a section to view content</div>
          )}
        </div>
      </div>
    </div>
  );
}
