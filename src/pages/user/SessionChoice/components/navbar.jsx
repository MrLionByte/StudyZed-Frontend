import { useEffect, useState, useRef } from 'react';
import {
  GraduationCap,
  Menu,
  UserCircle,
  LogOut,
  Bell,
  Wallet,
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

export default function Navbar() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userRole, setUserRole] = useState();
  const notificationRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserProfile = () => {
    const path_role = userRole.toLowerCase();
    navigate(`/${path_role}/profile/`);
    setShowAccountMenu(false);
  };

  const handleLogout = () => {
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
    }
  }, []);

  return (
    <nav className="bg-teal-900/50 backdrop-blur-sm relative z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between md:h-16">
          <Link to="/" className="flex items-center md:space-x-0 align-middle">
            <GraduationCap className="h-8 w-8 text-emerald-400" />
            <img className="size-1/2 md:size-1/4 mt-2" src={Logo} alt="Logo" />
          </Link>

          <div className="flex items-center space-x-4">
            {userRole === 'STUDENT' ? (
              <Link
                to="/student/student-wallet/"
                className="hover:text-emerald-400"
              >
                <Wallet />
              </Link>
            ) : (
              <Link
                to="/tutor/tutor-wallet/"
                className="hover:text-emerald-400"
              >
                <Wallet />
              </Link>
            )}

            <Notification ref={notificationRef} />

            <button
              className="p-2 hover:bg-teal-800 rounded-full relative"
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
