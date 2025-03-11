import { useEffect, useState } from "react";
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
} from "lucide-react";
import Navbar from "../SessionChoice/components/navbar";
import DashboardMain from "./tutor/Main/dashboardMain";
import Members from "./tutor/MyStudents/mystudents";
import Assessment from "./tutor/Assessment/assessment";
import Messaging from "./tutor/Messages/message";
import TutorTask from "./tutor/Task/task";
import Class from "./tutor/MyClass/class";
import MyAccount from "./tutor/MyAccount/myaccount";
import ClassProgress from "./tutor/ClassProgress/classProgress";
import StudyMaterial from './tutor/StudyMaterial/studyMaterial';
import { useLocation, useNavigate } from "react-router-dom";
import { clearSavedAuthData, getSavedAuthData } from "../../../utils/Localstorage";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slice";
import { saveSessionData, getSessionData } from "./components/currentSession";
import { TutorEndPoints } from '../../../api/endpoints/userEndPoints';
import { saveStudentsDataToSession } from './components/studentsInSession';
import { comment } from 'postcss';
import api, { API_BASE_URLS } from '../../../api/axios_api_call';

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", component: <DashboardMain /> },
  { icon: ClipboardList, label: "Assessment", id: "assessment", component: <Assessment /> },
  { icon: CheckSquare, label: "Tasks", id: "tasks", component: <TutorTask /> },
  { icon: MessageSquare, label: "Messages", id: "messages", component: <Messaging /> },
  { icon: School, label: "My Class", id: "class", component: <Class /> },
  { icon: Library, label: 'Study Materials', id: 'materials', component: <StudyMaterial/> },
  { icon: TrendingUp, label: "Class Progress", id: "progress", component: <ClassProgress /> },
  { icon: Users, label: "My Students", id: "members", component: <Members /> },
  { icon: UserCircle, label: "My Account", id: "account", component: <MyAccount /> },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("materials");
  const [sessionCode, setSessionCode] = useState("");
  const [sessionData, setSessionData] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate("/login/");
  };

  const handleMyAccount = () =>{
    const userData = getSavedAuthData()
    const role = userData?.role
    navigate(`/${role.toLowerCase()}/profile/`)
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar logout={handleLogout} />

      
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-3 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-md">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1">
       
        <div
          className={`fixed md:relative top-0 left-0 h-full bg-gray-900 p-4 transform md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex md:w-64 transition-transform duration-300 ease-in-out z-10 `}
        >
          <div className="w-full space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  {item.id === 'account' ?
                    handleMyAccount()
                    :
                    setActiveSection(item.id);
                  }
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-emerald-500 text-white"
                    : "hover:bg-teal-900/30 text-gray-300"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}

            
            <div className="border-t border-gray-700 pt-4 mt-2">
              <div className="flex flex-col space-y-2 text-gray-300 px-4">
                <p className="text-sm font-semibold">Session Code:</p>
                <p className="text-lg font-bold text-white">{sessionCode || "N/A"}</p>
                {/* <h5 className="w-3/4 font-bold bg-slate-500 text-white px-2 py-2 rounded-lg mt-3 text-center">
                  Tutor Dashboard
                </h5> */}
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex-1">{menuItems.find((item) => item.id === activeSection)?.component}</div>
      </div>
    </div>
  );
}
