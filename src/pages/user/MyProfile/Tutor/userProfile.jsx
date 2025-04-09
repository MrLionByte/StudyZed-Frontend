import { Pen, X, Check, ArrowLeft } from 'lucide-react';
import { useUserProfile } from './_lib.js';
import { OrbitProgress, ThreeDot } from 'react-loading-indicators';
import { ToastContainer } from 'react-toastify';

export default function MyProfile() {
  const {
    userData,
    profilePicture,
    previewUrl,
    handleChange,
    handleImageUpload,
    editUserData,
    handleEdit,
    newData,
    handleUserDataEdit,
    handleSave,
    handleCancelProfilePicEdit,
    handleCancelEdit,
    fileInputRef,
    handleProfilePictureEdit,
    loading,
    handleBackToSession,
  } = useUserProfile();

  return (
    <div className="bg-gradient-to-r from-black to-cyan-900 min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-md text-white border border-gray-700 h-max">
          <h1 className="text-green-400 font-bold text-xl mb-4">TUTOR</h1>
          <div className="flex flex-col items-center mb-6">
            
            {!loading ? (
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center relative mb-4 border-4 border-green-400">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    className="text-green-400 w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01-.664 6.844C16.253 19.6 14.21 21 12 21c-2.21 0-4.253-1.4-5.496-3.578a12.083 12.083 0 01-.664-6.844L12 14z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14v7m0 0a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"
                    ></path>
                  </svg>
                )}
                
                {!previewUrl ? (
                  <button
                    onClick={handleProfilePictureEdit}
                    className="absolute bottom-0 right-0 bg-green-400 p-2 rounded-full hover:bg-green-300 transition-colors"
                  >
                    <Pen className="w-4 h-4 text-gray-900" />
                  </button>
                ) : (
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={handleImageUpload}
                      className="bg-green-400 p-2 rounded-full hover:bg-green-300 transition-colors"
                    >
                      <Check className="w-4 h-4 text-gray-900" />
                    </button>
                    <button
                      onClick={handleCancelProfilePicEdit}
                      className="bg-red-400 p-2 rounded-full hover:bg-red-300 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-900" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-full overflow-hidden w-32 h-32 flex items-center justify-center">
                <OrbitProgress
                  variant="disc"
                  color="#4ade80"
                  size="medium"
                  text=""
                  textColor=""
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="image_url"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {['username', 'first_name', 'last_name'].map((field) => (
            <div key={field} className="mt-4">
              <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex justify-between items-center border border-gray-600">
                {editUserData[field] ? (
                  <>
                    {!loading ? (
                      <div className="flex-1">
                        <label className="text-xs text-green-400 font-medium mb-1 block">
                          {field.replace('_', ' ').toUpperCase()}
                        </label>
                        <input
                          type="text"
                          value={newData[field]}
                          onChange={(e) => handleUserDataEdit(field, e.target.value)}
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full flex-1">
                        <ThreeDot
                          color="#4ade80"
                          size="small"
                          text=""
                          textColor=""
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 ml-4">
                      <button className="text-green-400 hover:text-green-300" onClick={() => handleSave(field)}>
                        <Check className="w-5 h-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-300" onClick={() => handleCancelEdit(field)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs text-green-400 font-medium mb-1 block">
                        {field.replace('_', ' ').toUpperCase()}
                      </label>
                      <p className="text-white font-medium">{userData[field]}</p>
                    </div>
                    <button className="text-gray-400 hover:text-green-400" onClick={() => handleEdit(field)}>
                      <Pen className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md border border-gray-700">
            <h2 className="text-green-400 font-bold text-xl mb-4">CONTACT INFORMATION</h2>
            <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600 mb-4">
              <label className="text-xs text-green-400 font-medium mb-1 block">EMAIL</label>
              <p className="text-white font-medium">{userData.email}</p>
            </div>
            {/* <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600">
              <label className="text-xs text-green-400 font-medium mb-1 block">PHONE</label>
              <p className="text-white font-medium">{userData.phone || 'Not added'}</p>
            </div> */}
          </div>
          
          
          {/* <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md border border-gray-700">
            <h2 className="text-green-400 font-bold text-xl mb-4">ACTIVE SESSIONS</h2>
            <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600">
              <div className="text-white font-medium">Power Systems Analysis</div>
              <div className="text-sm text-gray-300 mt-1">POWER-9DF217</div>
              <div className="text-xs text-gray-400 mt-1">3 Students Enrolled</div>
            </div>
          </div> */}

        </div>
        
        <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
          <button
            onClick={handleBackToSession}
            className="bg-green-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            GO BACK TO SESSION
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}