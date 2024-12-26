import { useEffect, useReducer, useRef, useState } from 'react';
import api  from '../../../../api/axios_api_call.js';
import {mapFormToApi} from '../../../../api/helpers/apiMapper.js';


export const useUserProfile = () => {
    const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '', phone: '', username:'' });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [nowEdit, setNowEdit] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [editUserData, setEditUserData] = useState ({
        first_name: false,
        last_name: false,
        username: false,
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
                    username: data.username,
                    first_name: data.first_name,
                    last_name: data.last_name,
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

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select an image file');
        if (loading) return ;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('user-app/upload-profile-pic/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            setProfilePicture(response.data.data.profile_picture);
            setNowEdit(false);
            setLoading(false);
            setPreviewUrl('');
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    const handleEdit = (field) => {
        setEditUserData((prevState) => ({
            ...prevState,
            [field]: true,
        }));
        setNewData((prevState) => ({
            ...prevState,
            [field]: userData[field],
        }));
    };

    const handleUserDataEdit = (field, value) => {
        setNewData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleCancelProfilePicEdit = () => {
        setNowEdit(false); // Reset editing mode (optional, for tracking)
        setPreviewUrl(null); // Reset preview URL
    };

    const handleCancelEdit = (field) => {
        setEditUserData((prevState) => ({
            ...prevState,
            [field]: false,
        }));
    };

    const fileInputRef = useRef(null); // Ref for hidden file input

    const handleProfilePictureEdit = () => {
        setNowEdit(true); // Set editing mode (optional, for tracking)
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatically click the hidden file input
        }
    };

    const handleSave = async (field) => {
        if (newData[field] !== undefined) {
            try {
                console.log("NEW DATA ", newData[field], field);
                await api.patch(`user-app/update-profile/`, {
                    [field]: newData[field]
                });
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
        setPreviewUrl,
        editUserData,
        newData,
        setEditUserData,
        handleEdit,
        handleUserDataEdit,
        handleSave,
        handleCancelProfilePicEdit,
        handleCancelEdit,
        fileInputRef,
        handleProfilePictureEdit,
        loading
    }
    
}