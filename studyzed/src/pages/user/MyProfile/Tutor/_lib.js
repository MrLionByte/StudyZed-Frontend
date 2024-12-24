import { useEffect, useReducer, useState } from 'react';
import api  from '../../../../api/axios_api_call.js';

export const useUserProfile = () => {
    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '', userName:'' });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [nowEdit, setNowEdit] = useState(false);
    const [error, setError] = useState(null);

    const [editUserData, setEditUserData] = useState ({
        firstName: false,
        lastName: false,
        userName: false,
        phone: false,
        email: false,
    })

    const [newData, setNewData] = useState({}); 

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await api.get('user-app/user-profile/');
                const data = response.data;
                console.log(data);
                console.log(data.email);
                console.log(response.data);
                setUserData({
                    userName: data.username,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    email: data.email,
                    phone: data.phone,
                });
                const ProfilePicUrl = data.profile.profile_picture
                const validProfilepicUrl = ProfilePicUrl.startsWith("image/upload/https://")
                    ? ProfilePicUrl.replace("image/upload/","")
                : ProfilePicUrl;
                
                setProfilePicture(validProfilepicUrl);
                // setPreviewUrl(validProfilepicUrl);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        }
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFile(e.target.files[0]);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const handleImageUpload = async () => {
        if (!file) return alert('Please select an image file');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('user-app/upload-profile-pic/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            setProfilePicture(response.data.data.profile_picture);
            setNowEdit(false);
        } catch (error) {
            console.error(error);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    const handleEdit = (field) => {
        setEditUserData((prevState) => ({
            ...prevState,
            [field]: true,
        }));
    };

    const handleUserDataEdit = (field, value) => {
        setNewData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSave = async (field) => {
        if (newData[field] !== undefined) {
            try {
                await api.put(`user-app/`, {[field]: newData[field]})
                setUserData((prevState) => ({
                    ...prevState,
                    [field]: newData[field],
                }));
                setEditUserData((prevState) => ({
                    ...prevState,
                    [field]: false,
                }));
                setNewData((prevState) => {
                    const updated = { ...prevState };
                    delete updated[field];
                    return updated;
                });
                alert(`Your profile updated successfully`);
            } catch (error) {
                console.error('Failed to update profile:', error);
                alert('Error updating profile');
            }
        }
    }


    return {
        userData,
        setUserData,
        profilePicture,
        previewUrl,
        nowEdit,
        setNowEdit,
        handleChange,
        handleImageUpload,
        // handleProfileChange,
        // setEditUserData,
        // setChangedData,
    }
    
}