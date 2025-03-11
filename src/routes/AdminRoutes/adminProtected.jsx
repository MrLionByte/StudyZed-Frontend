import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from '../../pages/admin/interface/adminInterface.jsx';
import Dashboard from '../../pages/admin/interface/dashboard/dashboard.jsx';
import TutorManagement from '../../pages/admin/interface/userManagement/tutorManagement/tutorManagement.jsx';
import StudentManagement from '../../pages/admin/interface/userManagement/studentManagement/studentManagement.jsx';
import SessionApproval from '../../pages/admin/interface/sessionManagement/approval/tutorSession.jsx';
import ActiveSessions from '../../pages/admin/interface/sessionManagement/activeSessions/activeSession.jsx';
import PriceSetter from '../../pages/admin/interface/priceSetter/pricesetter.jsx';
import AssessmentsData from '../../pages/admin/interface/growthData/assessmentsData.jsx'
import SessionData from '../../pages/admin/interface/growthData/sessionsData.jsx'
import CompanyRevenue from '../../pages/admin/interface/growthData/companyRevenue.jsx'


import NotFound from '../../components/Errors/NotFound.jsx';

export default function TutorRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AdminHome />}>
        <Route index element={<Navigate to="dashboard/" replace />} />

        <Route path="dashboard/" element={<Dashboard />} />
        <Route path="tutor-management/" element={<TutorManagement />} />
        <Route path="student-management/" element={<StudentManagement />} />

        <Route path="session-approval/" element={<SessionApproval />} />
        <Route path="active-session/" element={<ActiveSessions />} />

        <Route path="price-setter/" element={<PriceSetter />} />

        <Route path="assessment-growth-data/" element={<AssessmentsData />} />
        <Route path="session-growth-data/" element={<SessionData />} />
        <Route path="company-growth-data/" element={<CompanyRevenue />} />

        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
