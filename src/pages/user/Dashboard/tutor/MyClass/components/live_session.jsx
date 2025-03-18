import React, { useEffect, useRef, useState } from 'react';
import { getSavedAuthData } from '../../../../../../utils/Localstorage';
import { getSessionData } from '../../../components/currentSession';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const GroupVideoCall = ({ onEndCall, sessionCode }) => {
  const videoRef = useRef(null);
  const zpRef = useRef(null);
  const [isCallInitialized, setIsCallInitialized] = useState(false);
  const user_data = getSavedAuthData();

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
    const APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    const roomID = sessionCode?.session_code;
    const userID = sessionCode?.tutor_code;
    const userName = user_data?.user?.username;
    const userAvatar = user_data?.user?.profile_image;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      APP_ID,
      SERVER_SECRET,
      roomID,
      userID,
      userName || 'Tutor',
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
      turnOnMicrophoneWhenJoining: true,
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
  };

  const handleCleanup = () => {
    console.log('Cleaning up ZegoCloud resources');
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

    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 max-h-screen">
      <div ref={videoRef} className="w-full h-full"></div>
      <button
        onClick={handleExitCall}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Exit Call
      </button>

      {!isCallInitialized && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>Connecting to session...</p>
        </div>
      )}
    </div>
  );
};

export default GroupVideoCall;
