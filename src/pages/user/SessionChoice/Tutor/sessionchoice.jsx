import { useEffect } from 'react';
import { ArrowRight, PlusCircleIcon } from 'lucide-react';
import './style.css';
import Navbar from '../components/navbar';
import LogoSvg from '../../../../assets/test.svg';
import SessionCard from './components/sessionCard';
import CreateNewSession from './components/createSessionCard';
import { useTutorSessions } from './_lib';
import { ToastContainer, Bounce } from 'react-toastify';

const TutorSessionPage = () => {
  const {
    sessions,
    loading,
    isModalOpen,
    activeTab,
    currentPage,
    totalPages,
    openModal,
    closeModal,
    handleEnterSession,
    handleCopyCode,
    handleTabChange,
    handlePageChange,
    copiedId
  } = useTutorSessions();

  return (
    <div className="min-h-screen text-white bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6 max-w-xs">
          {/* <button
            className={`flex-1 py-2 px-4 rounded-md text-center transition-all ${
              activeTab === 'active' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('active')}
          >
            Active
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center transition-all ${
              activeTab === 'expired' 
                ? 'bg-emerald-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleTabChange('expired')}
          >
            Expired
          </button> */}
        </div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-4 md:mb-0">My Teaching Sessions</h1>
          <button 
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
            onClick={openModal}
          >
            <PlusCircleIcon size={20} />
            <span className="hidden md:inline">CREATE NEW SESSION</span>
            <span className="md:hidden">NEW</span>
          </button>
        </div> 
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-96 h-96 animate-pulse"
          />
        </div>
      )}

      <div className="container mx-auto px-4 pb-12">
        {sessions?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard 
                key={session.id}
                session={session}
                copiedId={copiedId}
                onCopyCode={handleCopyCode}
                onEnterSession={handleEnterSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl">
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">No {activeTab} sessions found</h3>
            <p className="text-gray-400 mb-6">Create your first session to get started</p>
            <button 
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              onClick={openModal}
            >
              <PlusCircleIcon size={20} />
              <span>CREATE NEW SESSION</span>
            </button>
          </div>
        )}
        
        {sessions?.length > 0 && (
          <div className="flex justify-center items-center mt-28 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white hover:bg-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white hover:bg-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 backdrop-blur-sm">
          <CreateNewSession cancelModal={closeModal} />
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        className="toast-center"
      />
    </div>
  );
};

export default TutorSessionPage;