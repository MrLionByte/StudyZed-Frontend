import { useState, memo } from 'react';
import { useApproveSessionManagement } from './_lib.js';
import { ToastContainer, toast } from 'react-toastify';
import SessionPaymentDetails from './components/sessiondetailsmodal.jsx';
import { BadgeInfoIcon } from 'lucide-react';

const InActiveSessions = memo(() => {
  const {
    sessions,
    loading,
    error,
    isModalOpen,
    isOverlayActive,
    sessionDetails,
    sessionPayment,

    setIsOverlayActive,
    setIsModalOpen,
    setSessions,
    setLoading,
    setError,
    handleApproveSession,
    handleModal,
    handleApprove,
  } = useApproveSessionManagement();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-3">
        {sessions && Array.isArray(sessions) && sessions.length > 0 ? (
          <>
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`aspect-video rounded-xl flex flex-col items-center p-4 ${'bg-muted/50'}`}
              >
                <p className="font-bold">{session.session_code}</p>
                <p className="text-sm text-gray-400">
                  Session Name : {session.session_name}
                </p>
                <p className="text-sm text-gray-400">
                  Tutor Code : {session.tutor_code}
                </p>

                <button
                  className="inline-flex content-between gap-2 rounded bg-violet-500 mt-4 p-2 cursor-pointer hover:bg-green-600"
                  onClick={(e) =>
                    handleModal(
                      e,
                      session.session_code,
                      session.tutor_code,
                      session.id,
                    )
                  }
                >
                  Details <BadgeInfoIcon />
                </button>
              </div>
            ))}
            {isOverlayActive && <div className="overlay active"></div>}
            <ToastContainer
              autoClose={1000}
              closeOnClick
              pauseOnHover
              draggable
              position="top-center"
              theme="colored"
            />
          </>
        ) : (
          <p>No sessions found for approval.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SessionPaymentDetails
            SessionData={sessionPayment[0]}
            cancelModal={closeModal}
            handleSessionApproval={handleApproveSession}
          />
        </div>
      )}
    </div>
  );
});

export default InActiveSessions;
