import { useState } from 'react';
import {useTutorManagement} from './_lib.js';
import { ToastContainer, toast } from 'react-toastify';
import './style/style.css';

export default function TutorManagement() {

  const {
      tutors,
      handleBlockUser,
  } = useTutorManagement();

  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const confirmationToast = (e, tutorId, isActive, username) => {
      e.preventDefault();
      setIsOverlayActive(true);
      toast(
          ({ closeToast }) => (
              <div>
                  <p>Are you sure you want to {isActive ? "unblock" : "block"} user : {username}?</p>
                  <div className='flex justify-between'>
                  <button
                      className="rounded bg-green-500 text-white px-4 py-2 mt-2 cursor-pointer"
                      onClick={() => {
                          handleBlockUser(e, tutorId, isActive);
                          setIsOverlayActive(false);
                          closeToast();
                      }}
                  >
                      Yes
                  </button>
                  <button
                    className='rounded bg-red-500 text-white px-4 py-2 mt-2 cursor-pointer'
                    onClick={() => {
                      setIsOverlayActive(false);
                      closeToast();}}
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
              position: "top-center",
              onClose: () => setIsOverlayActive(false),
          }
      );
  };


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-5 md:grid-cols-3">
      {tutors ? <>
      {tutors.map((tutor) => (
        <div key={tutor.id} className={`aspect-video rounded-xl flex flex-col items-center p-4 ${
          !tutor.is_active ? 'bg-red-700' : 'bg-muted/50'}`} >
          {tutor.profile ?
          <img
            src={tutor.profile ? tutor.profile.profile_picture.replace("image/upload/", "") : ''}
            alt="Profile pic Unavailable"
            className="w-24 h-24 rounded-full object-cover mb-2 text-center"
          />
          : <p className="w-24 h-24 rounded-full object-cover text-center text-red-400"
          >Profile Pic NotAvilable</p>
          }
          <p className="font-bold">{tutor.username}</p>
          <p className="text-sm text-gray-400">First Name : {tutor.first_name}</p>
          <p className="text-sm text-gray-400">{tutor.email}</p>
          
          {(tutor.is_active) ? 
          <button className='rounded bg-slate-400 mt-4 p-2 cursor-pointer'
            onClick={(e)=> confirmationToast(e, tutor.id, false, tutor.username)}
            >BLOCK USER</button>
          :
          <button className='rounded bg-slate-400 mt-4 p-2 cursor-pointer hover:bg-green-400'
            onClick={(e)=> confirmationToast(e, tutor.id, true, tutor.username)}
            >UNBLOCK USER</button>
          }
        </div>
      ))}
      {isOverlayActive && <div className="overlay active"></div>}
      <ToastContainer
    autoClose={5000} 
    closeOnClick
    pauseOnHover
    draggable
    position="top-right"
    theme="colored"
/>  </>: 
    <></>
    }
    </div>
  </div>
  
  )
};