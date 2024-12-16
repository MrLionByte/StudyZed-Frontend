import { useState } from 'react';
import { useUserProfile } from './userprofilehandler.js'
import api from '../../../Api/axios_api_call.js'

export default function MyProfile () {
    // const { state } = useUserProfile();

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [profilepicture, setProfilepicture] = useState('');

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
            return;  // Return if no file selected  // else proceed with upload operation  // if no file selected return from function
        }
        
        try{
            const formData = new FormData();
            formData.append('file', file);
            console.log(formData);

            const response = await api.post('user-app/upload-profile-pic/',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file uploads
                },
            });
            console.log("RESPONSE DATA :", response.data['message']);
            
            setProfilepicture(response.data['message'])
            
        }catch(e){
            alert('Error', e);
            console.log(e);
        };
    };

    return (
        <div className="min-h-screen text-white">
            <div className="flex justify-center items-center min-h-[80vh]">
                <div className="border border-teal-500 p-6 rounded-md bg-black/80 shadow-md">
                    
                    {previewUrl && <img src={previewUrl} alt="Preview" width="200" />}
                    <input type="file"
                    name='image_url'
                    accept="image/jpeg,image/png,image/gif"
                    onChange={ handleChange} 
                    />

                    <button type='submit' onClick={handleImageUpload}>UPLOAD</button>
                    
                </div>
            </div>
            {profilepicture && <img src={profilepicture} alt='Uploaded Profile Picture' />}
        </div>
    );
};