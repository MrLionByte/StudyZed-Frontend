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
} from 'lucide-react';
import Navbar from '../SessionChoice/components/navbar';
import DashboardMain from './tutor/Main/dashboardMain';
import Members from './tutor/MyClass/mystudents';
import Assessment from './tutor/Assessment/assessment';
import Messaging from './tutor/Messages/message';
import TutorTask from './tutor/Task/task';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearSavedAuthData } from '../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice';
import { saveSessionData, getSessionData } from './components/currentSession';
import { comment } from 'postcss';
import api, { API_BASE_URLS } from '../../../api/axios_api_call';
import { TutorEndPoints } from '../../../api/endpoints/userEndPoints';
import { saveStudentsDataToSession } from './components/studentsInSession';

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
  { icon: CheckSquare, label: 'Tasks', id: 'tasks', component: <TutorTask /> },
  {
    icon: MessageSquare,
    label: 'Messages',
    id: 'messages',
    component: <Messaging />,
  },
  { icon: School, label: 'My Class', id: 'class' },
  { icon: TrendingUp, label: 'Class Progress', id: 'progress' },
  { icon: Users, label: 'My Students', id: 'members', component: <Members /> },
  { icon: UserCircle, label: 'My Account', id: 'account' },
];

export default function Dashboard() {
  // const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('tasks');
  const [sessionData, setSessionData] = useState('');
  const [sessionCode, setSessionCode] = useState('');

  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const renderActiveSection = () => {
    const activeItem = menuItems.find((item) => item.id === activeSection);
    return activeItem ? (
      activeItem.component
    ) : (
      <div>Select a section to view content</div>
    );
  };

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
  });

  const getAllStudentsInSession = async () => {
    try {
      const session = getSessionData();
      const url = API_BASE_URLS['Session_Service'];
      const response = await api.get(TutorEndPoints.AllowedStudentsInSession, {
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
        TutorEndPoints.StudentsDetailsList,
        studentCodes,
      );
      console.log(studentDetails.data);
      saveStudentsDataToSession(studentDetails.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    clearSavedAuthData();
    navigate('/login/');
    console.log('wadadasd');
  };

  const handleAccounts = () => {
    navigate('/tutor/profile/');
  };

  return (
    <div className="h-screen">
      <Navbar
        logout={handleLogout}
        userProfile={handleAccounts}
        sessionData={sessionData}
      />
      <div className="flex gap-8 h-fit">
        <div className="w-64 space-y-2 mt-4">
          {menuItems.map((item) => (
            <div key={item.id} className="flex flex-col justify-between">
              <button
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
            </div>
          ))}

          <div className="border-t border-gray-700 pt-4 mt-2">
            <div className="flex flex-col space-y-2 text-gray-300 px-4">
              <p className="text-sm font-semibold">Session Code:</p>
              <p className="text-lg font-bold text-white">{sessionCode}</p>

              <h5 className="w-3/4 font-bold bg-slate-500 text-white px-2 py-2 rounded-lg mt-3 text-center">
                Tutor Dashboard
              </h5>
            </div>
          </div>
        </div>

        <div className="flex-1">{renderActiveSection()}</div>
      </div>
    </div>
  );
}
