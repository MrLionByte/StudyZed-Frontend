import { useState, memo } from 'react';
import { useTutorManagement } from './_lib.js';
import { ToastContainer, toast } from 'react-toastify';
// import './style/style.css';

const StudentManagement = memo(() => {
  const { students, handleBlockUser } = useTutorManagement();

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-3">
        {students && Array.isArray(students) && students.length > 0 ? (
          <>
            {students.map((student) => (
              <div
                key={student.id}
                className={`aspect-video rounded-xl flex flex-col items-center p-4 ${
                  !student.is_active ? 'bg-red-700' : 'bg-muted/50'
                }`}
              >
                {student.profile ? (
                  <img
                    src={
                      student.profile
                        ? student.profile.profile_picture.replace(
                            'image/upload/',
                            '',
                          )
                        : ''
                    }
                    alt="Profile pic Unavailable"
                    className="w-24 h-24 rounded-full object-cover mb-2 text-center"
                  />
                ) : (
                  <p className="w-24 h-24 rounded-full object-cover text-center text-red-400">
                    Profile Pic NotAvilable
                  </p>
                )}

                <p className="font-bold">{student.username}</p>
                <p className="text-sm text-gray-400">
                  First Name : {student.first_name}
                </p>
                <p className="text-sm text-gray-400">{student.email}</p>

                {student.is_active ? (
                  <button
                    className="rounded bg-slate-400 mt-4 p-2 cursor-pointer"
                    onClick={(e) =>
                      confirmationToast(e, student.id, false, student.username)
                    }
                  >
                    BLOCK USER
                  </button>
                ) : (
                  <button
                    className="rounded bg-slate-400 mt-4 p-2 cursor-pointer hover:bg-green-400"
                    onClick={(e) =>
                      confirmationToast(e, student.id, true, student.username)
                    }
                  >
                    UNBLOCK USER
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
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
});

export default StudentManagement;
