import { useState, memo } from 'react';
import { useApproveSessionManagement } from './_lib.js';
import { ToastContainer, toast } from 'react-toastify';
import SessionPaymentDetails from './components/sessiondetailsmodal.jsx';

const SessionApproval = memo(() => {
  const {
    sessions,
    loading,
    error,
    isModalOpen,
    isOverlayActive,
    sessionDetails,
    sessionPayment,
    isConfirmModalOpen, 
    sessionToRejectId,

    setSessionToRejectId,
    setIsConfirmModalOpen,
    setIsOverlayActive,
    setIsModalOpen,
    setSessions,
    setLoading,
    setError,
    handleApproveSession,
    handleRejectSession,
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
                className={`aspect-video rounded-xl flex flex-col items-center p-4 ${
                  session?.is_active ? 'bg-blue-900' : 'bg-muted/50'
                }`}
              >
                <p className="font-bold">{session.session_code}</p>
                <p>{session.is_paid}</p>
                <p className="text-sm text-gray-400">
                  Session Name : {session.session_name}
                </p>
                <p className="text-sm text-gray-400">
                  Tutor Code : {session.tutor_code}
                </p>

                <button
                  className="rounded bg-violet-500 mt-4 p-2 cursor-pointer hover:bg-green-600"
                  onClick={(e) =>
                    handleModal(
                      e,
                      session.session_code,
                      session.tutor_code,
                      session.id,
                    )
                  }
                >
                  Approve & Details
                </button>

                <button
                  className="rounded bg-red-900 mt-4 p-2 cursor-pointer hover:bg-red-500"
                  onClick={() => {
                    setSessionToRejectId(session.id);
                    setIsConfirmModalOpen(true);
                  }} 
                >
                  Reject
                </button>

              </div>
            ))}

            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-gray-900 text-center">
                        <h3 className="text-lg font-bold">Are you sure you want to reject this session?</h3>
                        <p className="py-4">This action cannot be undone.</p>
                        <div className="flex justify-around mt-4">
                            <button 
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => {
                                  setSessionToRejectId(null);
                                  setIsConfirmModalOpen(false);
                                }} 
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                                onClick={handleRejectSession} 
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
            SessionData={sessionPayment}
            cancelModal={closeModal}
            handleSessionApproval={handleApproveSession}
          />
        </div>
      )}
    </div>
  );
});

export default SessionApproval;
