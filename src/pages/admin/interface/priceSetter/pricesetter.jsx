import { useState, memo, useEffect } from 'react';
// import {useTutorManagement} from './_lib.js';
import { ToastContainer, toast } from 'react-toastify';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import { adminEndPoints } from '../../../../api/endpoints/adminEndPoint';
// import './style/style.css';

const SessionPriceSetter = memo(() => {
  const [sessions, setSessions] = useState([]);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editedPrices, setEditedPrices] = useState({});

  const handleEditPrice = (sessionId, currentPrice) => {
    setIsEdit(sessionId);
    setEditedPrices((prev) => ({ ...prev, [sessionId]: currentPrice })); // Keep track of price changes
  };

  const getSessionPrices = async () => {
    try {
      const url = API_BASE_URLS['Payment_Service'];
      const responses = await api.get(adminEndPoints.GetSubscriptionPrice, {
        baseURL: url,
      });
      setSessions(responses.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getSessionPrices();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const confirmationToast = (e, studentId, isActive, username) => {
    e.preventDefault();
    setIsOverlayActive(true);
    toast(
      ({ closeToast }) => (
        <div>
          <p>
            Are you sure you want to {isActive ? 'unblock' : 'block'} user :{' '}
            {username}?
          </p>
          <div className="flex justify-between">
            <button
              className="rounded bg-green-500 text-white px-4 py-2 mt-2 cursor-pointer"
              onClick={() => {
                handleBlockUser(e, studentId, isActive);
                setIsOverlayActive(false);
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="rounded bg-red-500 text-white px-4 py-2 mt-2 cursor-pointer"
              onClick={() => {
                setIsOverlayActive(false);
                closeToast();
              }}
            >
              NO
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: 'top-center',
        onClose: () => setIsOverlayActive(false),
      },
    );
  };

  const handlePriceChange = (sessionId, newPrice) => {
    setEditedPrices((prev) => ({ ...prev, [sessionId]: newPrice }));
  };

  const handleSavePrice = async (sessionId) => {
    try {
      const url = API_BASE_URLS['Payment_Service'];
      const responses = await api.patch(
        `price-setter/update-amount/${sessionId}/`,
        { amount: editedPrices[sessionId] },
        { baseURL: url },
      );
      setSessions(responses.data);
      toast.success('Successfully updated price');
      setFetchFromBackend(true);
    } catch (err) {
      console.error(err);
    }
    setIsEdit(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-3">
        {sessions && Array.isArray(sessions) && sessions.length > 0 ? (
          <>
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`aspect-video rounded-xl flex flex-col items-center p-4 bg-muted/50`}
              >
                <p className="font-bold">
                  {session.duration} month{session.duration > 1 ? 's' : ''}
                </p>
                {isEdit === session.id ? (
                  <input
                    type="number"
                    value={editedPrices[session.id] || session.amount}
                    onChange={(e) =>
                      handlePriceChange(session.id, e.target.value)
                    }
                    className="border p-1 text-center"
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    Price: {session.amount}
                  </p>
                )}

                {isEdit === session.id ? (
                  <button
                    className="p-2 mt-10 border rounded-md bg-teal-400 text-black"
                    onClick={() => handleSavePrice(session.id)}
                  >
                    SAVE
                  </button>
                ) : (
                  <button
                    className="p-2 mt-10 border rounded-md hover:bg-teal-400 hover:text-black"
                    onClick={() => handleEditPrice(session.id, session.amount)}
                  >
                    EDIT PRICE
                  </button>
                )}
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
          <p>No session price found.</p>
        )}
      </div>
    </div>
  );
});

export default SessionPriceSetter;
