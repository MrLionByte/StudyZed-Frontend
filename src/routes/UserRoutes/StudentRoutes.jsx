import { Routes, Route } from 'react-router-dom';
import {FontProvider} from '../../context/FontContext';
import {ThemeProvider} from '../../context/ThemeContext';
import {SideBarColorProvider} from '../../context/SideBarColorContext';
import {NavBarColorProvider} from '../../context/NavbarColorContext';
import SessionChoice from '../../pages/user/SessionChoice/Student/sessionchoice';
import Dashboard from '../../pages/user/Dashboard/userDashboard';
import MyProfile from '../../pages/user/MyProfile/Student/userProfile';
import Wallet from '../../pages/user/Wallet/wallet';
import NotFound from '../../components/Errors/NotFound';


export default function TutorRoutes() {
  return (
    <Routes>
      <Route path="choose-session/" element={<SessionChoice />} />
      <Route path="enter-session/" element={
                <ThemeProvider>
                  <FontProvider>
                    <SideBarColorProvider>
                      <NavBarColorProvider>
                        <Dashboard />
                      </NavBarColorProvider>
                    </SideBarColorProvider>
                  </FontProvider>
                </ThemeProvider>
                  } />

      <Route path="profile/" element={<MyProfile />} />
      {/* <Route path="student-wallet/" element={<Wallet />} /> */}

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
