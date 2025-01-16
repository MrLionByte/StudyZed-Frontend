import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import './style.css'
import { useDispatch } from 'react-redux';
import {logout} from '../../../../redux/slice'
import CreateNewSession from './components/create_session_card'

const TutorSessionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinSession = () => {
    setIsJoinSession(true); //
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleUserRoundIcon= () => {
    navigate('/tutor/profile/')
  };

  const cancelSessionJoin = () => {
    setIsJoinSession(false);
  };

  const handleLogout = () => {
    console.log("LOGOUTINGG");
    
    dispatch(logout());
    navigate('/login/');
  };

  return (
    <div className="min-h-screen text-white">
    <nav className="flex justify-between items-center px-8 py-4">
      <div className="text-lg font-bold">StudyZen</div>
      <ul className="flex space-x-8">
        <li><a href="#" className="hover:text-teal-300">Home</a></li>
        <li><a href="#" className="hover:text-teal-300">About Us</a></li>
        <li><a href="#" className="hover:text-teal-300">FAQ</a></li>
      </ul>
      <div className="flex items-center gap-6">
        <CircleUserRound className="cursor-pointer" />
        <button className="bg-red-900 rounded p-2 cursor-pointer" onClick={handleLogout}>LOG-OUT</button>
      </div>
    </nav>

    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
        <p className="text-xl font-semibold">Session By:</p>
        <p className="text-lg">Yor</p>
        <p className="text-xl font-semibold mt-4">Session:</p>
        <p className="text-lg">EEE</p>
      </div>
    </div>

    <div className="flex items-center justify-center">
      <button className="default_button p-3" onClick={openModal}>
        CREATE NEW SESSION
      </button>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateNewSession cancelModeal={closeModal} />
      </div>
    )}
  </div>
  );
};

export default TutorSessionPage;
