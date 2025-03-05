import React, { useState } from 'react';
import { Phone, X, Mic, MicOff, Video, VideoOff, User,Users } from 'lucide-react';
import { getSavedAuthData } from '../../../../../utils/Localstorage';
import { getSessionData } from '../../components/currentSession';
import { getStudentByCode } from '../../components/studentsInSession';
import OneToOneCall from './components/one_on_one';

function Class() {
  const [sessionType, setSessionType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'calling' | 'connected'
  const [searchQuery, setSearchQuery] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const tutor_data = getSavedAuthData();
  const session_data = getSessionData();
  const students = getStudentByCode();
  console.log("STU :",students);
  
  const filteredStudents = students.filter(student => 
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionType = (type) => {
    setSessionType(type);
    if (type === 'one-to-one') {
      
    } else if (type === 'group') {
      setCurrentCall(session_data);
      setShowVideoCall(true);
    }
  };

  const initiateCall = (student) => {
    setSelectedStudent(student);
    setCallStatus('calling');
    
    
    setTimeout(() => {
      setCallStatus('connected');
    }, 3000);
  };

  const endCall = () => {
    setCallStatus('idle');
    setSelectedStudent(null);
    setShowVideoCall(false);
    setCurrentCall(null);
  };

  return (
    <>
      <div className="flex">
        <main className="flex-1">
          <div className="max-w-6xl mx-auto">
            
            {!sessionType && (
              <div className="bg-emerald-200 bg-opacity-10 shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Select Session Type</h2>
                <div className="grid gap-4">
                  <button
                    className="flex flex-col items-center justify-center p-6 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                    onClick={() => handleSessionType('one-to-one')}
                  >
                    <User className="h-12 w-12 text-emerald-600 mb-2" />
                    <span className="text-lg font-medium">One-to-One Session</span>
                    <p className="text-gray-500 text-center mt-2">Schedule individual sessions with students</p>
                  </button>
                  
                  <button
                    className="flex flex-col items-center justify-center p-6 border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                    onClick={() => handleSessionType('group')}
                  >
                    <Users className="h-12 w-12 text-emerald-600 mb-2" />
                    <span className="text-lg font-medium">Group Session</span>
                    <p className="text-gray-500 text-center mt-2">Schedule live sessions with multiple students</p>
                  </button>
                </div>
              </div>
            )}
            
            {sessionType === 'one-to-one' && callStatus === 'idle' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Video className="h-6 w-6 mr-2" />
                    <h2 className="text-lg font-semibold">One-to-One Video Call</h2>
                  </div>
                  <button 
                    onClick={() => setSessionType(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Your Students</h3>
                  
                  <div className="space-y-3">
                    {filteredStudents.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            {student.profile?.profile_picture ? (
                              <img 
                                src={student.profile.profile_picture.slice(13)} 
                                alt={student.username} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User size={20} className="text-gray-500" />
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{student.username}</p>
                            <p className="text-xs text-gray-500">{student.email || 'No email available'}</p>
                          </div>
                        </div>
                        
                        <button
                          className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          onClick={() => initiateCall(student)}
                        >
                          <Phone size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      
      {sessionType === 'one-to-one' && callStatus === 'calling' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 flex flex-col items-center">
            <div className="relative mb-4">
              {selectedStudent.profile?.profile_picture ? (
                <img 
                  src={selectedStudent.profile.profile_picture.slice(13)} 
                  alt={selectedStudent.username} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={40} className="text-gray-500" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{selectedStudent.username}</h3>
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
          onEndCall={()=> setSessionType(null)}
          userToken={tutor_data?.accessToken}
        />
      )}
    </>
  );
}

export default Class;