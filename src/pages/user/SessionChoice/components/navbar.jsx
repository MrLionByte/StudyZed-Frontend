import { useEffect, useState, useRef } from 'react';
import {
  GraduationCap,
  Menu,
  UserCircle,
  LogOut,
  Bell,
  Wallet,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../../assets/studyzed_main.png';
import {
  clearSavedAuthData,
  getSavedAuthData,
} from '../../../../utils/Localstorage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../redux/slice';
import Notification from '../../Dashboard/components/notification';
import logoutUser from '../../../../utils/LogoutApi';
import { useNavBarColor } from '../../../../context/NavbarColorContext';

export default function Navbar() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userRole, setUserRole] = useState();
  const notificationRef = useRef();

  const { navBarColor } = useNavBarColor() || '#134E4A80';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserProfile = () => {
    const path_role = userRole.toLowerCase();
    navigate(`/${path_role}/profile/`);
    setShowAccountMenu(false);
  };

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    clearSavedAuthData();
    setShowAccountMenu(false);
    navigate('/login/');
  };

  const userData = getSavedAuthData();

  useEffect(() => {
    if (!userRole) {
      setUserRole(userData?.role);
    }
  }, []);

  useEffect(() => {
    if (!userRole) {
      setUserRole(userData?.role);
    }

    if (notificationRef.current) {
      notificationRef.current.refreshNotifications();
      notificationRef.current.requestNotificationPermission(userData.user_code);
      console.log("REFRESGING");
      
    }
  }, []);

  return (
    <nav className=" backdrop-blur-sm relative z-10" style={{backgroundColor: navBarColor }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between md:h-16">
          <div className="flex items-center md:size-96">
            <GraduationCap className="hidden md:block size-14 text-emerald-400" />
            <img className="w-28 md:w-fit md:h-36 object-cover object-center" src={Logo} alt="Logo" />
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-emerald-400 hover:bg-teal-800 transition-colors rounded-full p-2">
              <Home />
            </Link>
            {userRole === 'STUDENT' ? (
              <Link
                to="/student/student-wallet/"
                className="text-emerald-400 hover:bg-teal-800 transition-colors p-2 rounded-full"
              >
                <Wallet />
              </Link>
            ) : (
              <Link
                to="/tutor/tutor-wallet/"
                className="text-emerald-400 hover:bg-teal-800 rounded-full p-2"
              >
                <Wallet />
              </Link>
            )}

            <Notification ref={notificationRef} />

            <button
              className="p-2 text-emerald-400 hover:bg-teal-800 rounded-full relative"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <UserCircle className="h-6 w-6 text-emerald-400" />
            </button>

            {showAccountMenu && (
              <div
                className="absolute right-4 z-50
              top-16 w-48 py-2 bg-teal-900/95 backdrop-blur-sm rounded-lg shadow-xl"
                style={{ zIndex: 9999 }}
              >
                <button
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-teal-800 transition-colors"
                  onClick={handleUserProfile}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <button
                  className="w-full flex
                items-center space-x-2 px-4 py-2 hover:bg-teal-800 transition-colors text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
