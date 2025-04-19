import {
  User,
  X,
  Calendar,
  Clock,
  CalendarCheck,
  CalendarCog,
} from 'lucide-react';
import OneToOneCall from './components/one_on_one';
import GroupCall from './components/live_session';
import { ToastContainer } from 'react-toastify';
import LogoSvg from '../../../../../assets/test.svg';
import {useSessionSelection} from './_lib';

const SessionSelection = () => {
  const {
    session_data,
    selectedDay,
    sessionType,
    setSessionType,
    callStatus,
    selectedStudent,
    endCall,
    handleSessionSchedule,
    formData,
    handleChange,
    handleDaySelection,
    handleTimeChange,
    dueTime,
    handleScheduleSession,
    isScheduling,
    loading,
    groupSession,
    handleAttendCall,
    handleEndCall,
  } = useSessionSelection();

  return (
    <div className="grid place-items-center min-h-full">
      <div className="grid gap-4 p-2">

        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-medium text-white mb-4">
            Latest Scheduled Group Session
          </h2>

          <div className="flex flex-col gap-5">
            {!isScheduling ? (
              <>
                {groupSession ? (
                  <div
                    className="flex flex-col items-start p-6 border-2 border-emerald-500 
          rounded-lg w-full"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CalendarCheck className="h-12 w-12 text-white bg-emerald-500 p-2 rounded-lg" />
                      <h3 className="text-lg font-semibold">
                        Session {groupSession.status}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm">
                        {groupSession.started_at.slice(0, 10)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <Clock className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm">
                        {groupSession.started_at.slice(11, 16)}
                      </p>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      <span className="mr-2 font-semibold ">About :</span>
                      {groupSession.description}
                    </p>
                    {groupSession.status == 'live' ? (
                      <button
                        className="flex flex-col items-center justify-center p-3 
              border-2 border-emerald-500 rounded-lg hover:bg-emerald-500 
              transition-all duration-300 w-full"
                        onClick={() => setSessionType('group')}
                      >
                        Attend Session
                      </button>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center p-3 
          border-2 border-red-500 rounded-lg 
          transition-all duration-300 w-full"
                      >
                        Session {groupSession.status}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-start p-6 border-2 border-emerald-500 
          rounded-lg w-full"
                  >
                    <h1 className="text-center font-bold text-red-400">
                      No Session Scheduled
                    </h1>
                  </div>
                )}

                {groupSession.status == 'ended' ||
                  (groupSession == '' && (
                    <button
                      className="flex flex-col items-center justify-center p-6 
          border-2 border-emerald-500 rounded-lg hover:bg-emerald-500 
          transition-all duration-300 w-full"
                      onClick={handleSessionSchedule}
                    >
                      Schedule a Session
                    </button>
                  ))}
              </>
            ) : (
              <div className="flex flex-col p-6 border-2 border-emerald-500 rounded-lg w-full">
                <form onSubmit={handleScheduleSession}>
                  <div className="flex flex-col items-center space-x-3 mb-4">
                    <CalendarCog className="h-12 w-12 text-white bg-emerald-500 p-2 rounded-lg" />
                    <h3 className="text-lg font-semibold">
                      Schedule New Session
                    </h3>
                    <p>Maximum 2 days from today</p>
                  </div>

                  <div className="flex items-center space-x-4 mb-3 justify-center">
                    <label className="flex items-center space-x-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="daySelection"
                        value="today"
                        checked={selectedDay === 'today'}
                        onChange={() => handleDaySelection('today')}
                        className="w-5 h-5 accent-emerald-500 cursor-pointer"
                      />
                      <span>Today</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="daySelection"
                        value="tomorrow"
                        checked={selectedDay === 'tomorrow'}
                        onChange={() => handleDaySelection('tomorrow')}
                        className="w-5 h-5 accent-emerald-500 cursor-pointer"
                      />
                      <span>Tomorrow</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4 mb-3 justify-center">
                    <div>
                      <label
                        htmlFor="dueTime"
                        className="block text-sm font-medium text-emerald-400"
                      >
                        Due Time (optional : default 24:00)
                      </label>
                      <input
                        type="time"
                        id="dueTime"
                        value={dueTime}
                        onChange={handleTimeChange}
                        className="mt-1 block w-full rounded bg-emerald-900/30 border border-emerald-800 
              text-white placeholder-emerald-700 focus:border-emerald-600 
              focus:ring focus:ring-emerald-600/50"
                      />
                    </div>
                  </div>

                  <label htmlFor="description">Enter a Description:</label>
                  <textarea
                    name="description"
                    id="description"
                    className="w-full p-1 rounded-lg bg-transparent border text-white"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>

                  <div className="flex justify-center mt-5">
                    <button
                      type="submit"
                      className="rounded-full p-2 bg-emerald-600 font-bold hover:bg-blue-500"
                    >
                      Schedule Now
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {sessionType === 'one-to-one' && callStatus === 'calling' && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={40} className="text-gray-500" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {selectedStudent?.username}
              </h3>
              <p className="text-gray-500 mb-6">Calling...</p>

              <div className="flex space-x-4">
                <button
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  onClick={endCall}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {sessionType === 'one-to-one' && callStatus === 'connected' && (
          <OneToOneCall
            currentCall={selectedStudent}
            onEndCall={() => setSessionType(null)}
          />
        )}

        {sessionType === 'group' && (
          <GroupCall
            sessionCode={session_data?.sessions}
            attendedCall={handleAttendCall}
            onEndCall={handleEndCall}
          />
        )}
      </div>
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
      className="toast-center"
    />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 z-50">
          <img
            src={LogoSvg}
            alt="Loading"
            className="w-64 h-64 animate-pulse"
          />
        </div>
      )}
    </div>
  );
};

export default SessionSelection;
