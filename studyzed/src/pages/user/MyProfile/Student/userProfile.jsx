import { useState } from 'react';
import { fetchUserProfile } from './userprofilehandler.js'
import api from '../../../../api/axios_api_call.js'
import { UserPen } from 'lucide-react';

export default function MyProfile () {
    const [userData, setUserData] = useState({ firstName: '', lastName: ''});
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [profilepicture, setProfilepicture] = useState('');
    const [nowEdit, setNowEdit] = useState(false);

    const [coverPhoto, setCoverPhoto] = useState();
    

    function handleChange(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFile(e.target.files[0]);
                console.log(file, "FILE");
                
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const handleImageUpload = async () => {
        if (!file){
            alert('Please select an image file');
            return;  
        }
        
        try{
            const formData = new FormData();
            formData.append('file', file);
            console.log(formData);

            const response = await api.post('user-app/upload-profile-pic/',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("RESPONSE DATA :", response.data['message']);
            
            setProfilepicture(response.data['message'])
            
        }catch(e){
            alert('Error', e);
            console.log(e);
        };
    };

    const handleNowEdit = () => {
        setNowEdit(true);
    }

    return (
        // <div className="min-h-screen text-white">
        //     <div className="flex justify-center items-center min-h-[80vh]">
        //         <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
                    
        //             {previewUrl && <img src={previewUrl} alt="Preview" width="200" />}
        //             <input type="file"
        //             name='image_url'
        //             accept="image/jpeg,image/png,image/gif"
        //             onChange={ handleChange} 
        //             />

        //             <button type='submit' onClick={handleImageUpload}>UPLOAD</button>
                    
        //         </div>
        //     </div>
        //     {profilepicture && <img src={profilepicture} alt='Uploaded Profile Picture' />}
        // </div>

        <div className="bg-gradient-to-r from-black to-cyan-900 min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Left Card */}
        <div className="bg-gray-300 p-6 rounded-lg shadow-md text-black">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-teal-800 rounded-full flex items-center justify-center">
              {/* Avatar Placeholder */}
            {(nowEdit) ? <>
                <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
                    
                     {previewUrl && <img src={previewUrl} alt="Preview" width="200" />}
                     <input type="file"
                     name='image_url'
                     accept="image/jpeg,image/png,image/gif"
                     onChange={ handleChange} 
                     />

                     <button type='submit' onClick={handleImageUpload}>UPLOAD</button>
                    
                 </div>
            </> : <>
            {(!previewUrl) ? <>
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
             <UserPen onClick={handleNowEdit} className='absolute text-black mt-24 cursor-pointer hover:text-red-500' />
            </>
            
            : <>
              <img src={previewUrl} onChange={ handleChange} alt="Preview" width="200" />
            </>}
             </> 
            }

            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-600">
                USERNAME: <span className="font-bold">mrlionbyte</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">FIRST NAME</p>
              <div className="bg-white rounded p-2"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">LAST NAME</p>
              <div className="bg-white rounded p-2"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white rounded p-4">

            { userData.profile == null ? <>
                                <p>Other data not added</p>
                            </> : <>
                                <p>  </p>
                            </>}

            </div>
          </div>
        </div>

        {/* Right Cards */}
        <div className="flex flex-col gap-6">
          {/* Email and Phone */}
          <div className="bg-gray-300 rounded-lg p-6 shadow-md">
            <p className="text-sm text-gray-600">
              EMAIL :{" "}
              <span className="font-bold text-gray-800">
                {userData.email}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              PHONE : <span className="font-bold text-gray-800">Not added </span>
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-300 rounded-lg p-6 shadow-md">
            <p className="font-bold text-gray-800">PAYMENT DETAILS</p>
          </div>
        </div>
      </div>
    </div>
    );
};