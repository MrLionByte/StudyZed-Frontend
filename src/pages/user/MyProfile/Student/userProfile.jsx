import { useState, useRef } from 'react';
import { UserPen, Pen, CircleCheck, CircleX, X, Check, ArrowLeft,GraduationCap } from 'lucide-react';
import { useUserProfile } from './_lib.js';
import { ToastContainer } from 'react-toastify';
import Logo from '../../../../assets/studyzed_main.png';

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
    handleBackToSession,
  } = useUserProfile();

  return (
    <div className="bg-gradient-to-r from-gray-900 to-cyan-900 min-h-screen p-6">
     
      <div className="hidden md:block">
        <div className="flex items-center">
            <GraduationCap className="hidden md:block size-14 text-emerald-400" />
            <img className="ml-3 mt-2 w-36 md:w-56 md object-cover object-center" src={Logo} alt="Logo" />
          </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 shadow-lg">
              <h3 className="text-green-400 font-bold mb-6">STUDENT</h3>
              
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full relative mb-4">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-400"
                    />
                  ) : profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-400"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-green-400">
                      <UserPen className="text-green-400 w-12 h-12" />
                    </div>
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
                <div key={field} className="mb-4">
                  <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex justify-between items-center border border-gray-600">
                    {editUserData[field] ? (
                      <>
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

          
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 shadow-lg h-max">
              <h3 className="text-green-400 font-bold mb-6">CONTACT INFORMATION</h3>
              
              <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600 mb-4">
                <label className="text-xs text-green-400 font-medium mb-1 block">EMAIL</label>
                <p className="text-white font-medium">{userData.email}</p>
              </div>
              
              {/* <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600">
                <label className="text-xs text-green-400 font-medium mb-1 block">PHONE</label>
                <p className="text-white font-medium">{userData.phone || 'Not added'}</p>
              </div> */}
              
              <div className="mt-6">
                {/* <h3 className="text-green-400 font-bold mb-4">CURRENT SESSION</h3>
                <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4 border border-gray-600">
                  <div className="text-white mb-2">Power Systems Analysis</div>
                  <div className="text-sm text-gray-400 mb-1">Tutor: ABIJI-D9DC3E0</div>
                  <div className="text-sm text-gray-400">Joined: Apr 8, 2025</div>
                </div> */}
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBackToSession}
              className="bg-green-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              BACK TO SESSION
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}