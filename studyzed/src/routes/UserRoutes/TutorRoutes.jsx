import { Routes, Route } from 'react-router-dom'
import TutorSessionPage from  '../../pages/user/SessionChoice/Tutor/sessionchoice'
import MyProfile from '../../pages/user/MyProfile/Tutor/userProfile'
import NotFound from '../../components/Errors/NotFound';
import PaymentSuccess from '../../pages/user/SessionPayment/payment_success';
import PaymentFailed from '../../pages/user/SessionPayment/payment_failed';
import PaymentCancelled from '../../pages/user/SessionPayment/payment_cancel';
import Wallet from '../../pages/user/Wallet/wallet';
import Dashboard from '../../pages/user/Dashboard/tutorDashboard';

export default function TutorStates () {
    return (
        <Routes>
            <Route path={ 'choose-session/' } element={<TutorSessionPage />} />
            <Route path={ 'payment-success/' } element={<PaymentSuccess />} />
            <Route path={ 'payment-failed/' } element={<PaymentFailed />} />
            <Route path={ 'payment-cancel/' } element={<PaymentCancelled />} />
            
            <Route path={ 'enter-session/' } element={<Dashboard />} />

            <Route path='profile/' element={<MyProfile />} />
            
            <Route path='tutor-wallet/' element={<Wallet />} />

            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
};