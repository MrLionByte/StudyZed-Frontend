import React, { useEffect, useRef, useState } from 'react';
import { getSessionData } from '../../../components/currentSession';
import { getSavedAuthData } from '../../../../../../utils/Localstorage';
import { X } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { toast } from 'react-toastify';

const StudentGroupVideoCall = ({ onEndCall }) => {
  const videoRef = useRef(null);
  const zpRef = useRef(null);
  const [isCallInitialized, setIsCallInitialized] = useState(false);

  const session_data = getSessionData();
  const sessionCode = session_data?.sessions?.session_code;
  const student_data = getSavedAuthData();
  const userId = student_data?.user?.id;
  const userName = student_data?.user?.username;
  const userAvatar = student_data?.user?.profile_image;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        initZegoCloud();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      handleCleanup();
    };
  }, []);

  const initZegoCloud = async () => {
    try {
      const APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      const roomID = sessionCode;
      const userID = userId
        ? userId.toString()
        : `student-${Math.floor(Math.random() * 10000)}`;

      if (!videoRef.current) {
        console.error('Video container ref is not available');
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomID,
        userID,
        userName || 'Student',
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      const avatarConfig = userAvatar
        ? {
            url: userAvatar,
            backgroundColor: '#2F80ED',
          }
        : undefined;

      await zp.joinRoom({
        container: videoRef.current,
        sharedLinks: [],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,

        showPreJoinView: false,

        showRoomDetailsButton: false,
        showInviteToCohostButton: false,
        showRemoveCohostButton: false,

        showNicknameUpdateButton: false,
        avatar: avatarConfig,

        maxUsers: 60,
        layout: 'Auto',
        showLayoutButton: true,
        onLeaveRoom: handleCleanup,
      });

      setIsCallInitialized(true);
    } catch (error) {
      toast.error("Minor error in video call, try again")
    }
  };

  const handleCleanup = () => {
    if (zpRef.current) {
      try {
        zpRef.current.destroy();
        zpRef.current = null;
      } catch (error) {
        console.error('Error during ZegoCloud cleanup:', error);
      }
    }
  };

  const handleExitCall = () => {
    handleCleanup();
    if (onEndCall) {
      onEndCall();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 max-h-screen">
      <div
        ref={videoRef}
        className="w-full h-full"
        id="student-video-container"
      ></div>

      <button
        onClick={handleExitCall}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <X size={16} />
        <span>Exit Call</span>
      </button>

      {!isCallInitialized && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>Connecting to session...</p>
        </div>
      )}
    </div>
  );
};

export default StudentGroupVideoCall;
