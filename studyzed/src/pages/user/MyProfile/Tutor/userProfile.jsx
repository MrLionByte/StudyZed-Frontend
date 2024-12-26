import { UserPen, Pen, CircleCheck, CircleX, X, Check } from 'lucide-react'; // Ensure you have these icons imported
import { useUserProfile } from './_lib.js';
import { OrbitProgress, ThreeDot } from 'react-loading-indicators';

export default function MyProfile() {
    const {
        userData,
        profilePicture,
        previewUrl,
        setPreviewUrl,
        nowEdit,
        setNowEdit,
        handleChange,
        handleImageUpload,
        editUserData,
        handleEdit,
        setEditUserData,
        newData,
        handleUserDataEdit,
        handleSave,
        handleCancelProfilePicEdit,
        handleCancelEdit,
        fileInputRef,
        handleProfilePictureEdit,
        loading
    } = useUserProfile();






    return (

        <div className="bg-gradient-to-r from-black to-cyan-900 min-h-screen flex items-center justify-center p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {/* Left Card */}
                <div className="bg-gray-300 p-6 rounded-lg shadow-md text-black h-max">
                    <div className="flex flex-col items-center mb-6">
                        {/* Profile Picture */}
{!loading ?
                        <div className="w-32 h-32 bg-teal-800 rounded-full flex items-center justify-center relative">
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
            className="text-white w-16 h-16"
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
    {/* UserPen Icon */}
    {!previewUrl ? (
        <UserPen
            onClick={handleProfilePictureEdit}
            className="absolute bottom-2 left-7 text-black cursor-pointer hover:text-red-500 rounded-full bg-gray-600"
        />
    ) : (
        <>
            <CircleCheck
                onClick={handleImageUpload}
                className="absolute bottom-2 rounded-full  bg-slate-300 left-8 text-black cursor-pointer hover:text-teal-500 z-10"
            />
            <CircleX
                onClick={handleCancelProfilePicEdit}
                className="absolute bottom-2 right-8 rounded-full  bg-slate-300 text-black cursor-pointer hover:text-red-500 z-10"
            />
        </>
    )}
</div>
: 
<div className='rounded-full overflow-hidden'>
<OrbitProgress variant="disc" color="#32cd32" size="medium" text="" textColor="" />
</div>
}
                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="image_url"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>

                    {/* User Details */}
                    {['username', 'first_name', 'last_name'].map((field) => (
                        <div key={field} className="mt-4">
                            <div className="bg-white rounded p-2 flex justify-between items-center">
                                {editUserData[field] ? (
                                    <>
                                    {!loading ? 
                                        <input
                                            type="text"
                                            value={newData[field]}
                                            onChange={(e) => handleUserDataEdit(field, e.target.value)}
                                            className="flex-grow px-2 py-1 border rounded"
                                        />
                                        : <div className="flex justify-center items-center h-full">
                                              <ThreeDot color="#32cd32" size="small" text="" textColor="" />
                                        </div>
                                            }
                                        <div className="flex items-center gap-2">
                                            <Check
                                                onClick={() => handleSave(field)}
                                                className="cursor-pointer hover:text-teal-500"
                                            />
                                            <X
                                                onClick={() => handleCancelEdit(field)}
                                                className="cursor-pointer hover:text-red-500"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600">
                                            {field.toUpperCase()}:
                                            <span className="text-black font-semibold pl-2">{userData[field]}</span>
                                        </p>
                                        <Pen
                                            onClick={() => handleEdit(field)}
                                            className="cursor-pointer hover:text-teal-500"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Cards */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-300 rounded-lg p-6 shadow-md">
                        <p className="text-sm text-gray-600">
                            EMAIL: <span className="font-bold text-gray-800">{userData.email}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            PHONE: <span className="font-bold text-gray-800">{userData.phone || 'Not added'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
