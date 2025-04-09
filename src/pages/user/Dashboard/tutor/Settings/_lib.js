import { useState, useEffect } from 'react';
import { useFont } from '../../../../../context/FontContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { useSideBarColor } from '../../../../../context/SideBarColorContext';
import { useNavBarColor } from '../../../../../context/NavbarColorContext';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from './components/toast-config.jsx';

export const useSettings = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isRenewModal, setIsRenewModal] = useState(false);
  const [isSavingImg, setIsSavingImg] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState({});

  const { fontSettings, fontUpdateSettings, fontClasses } = useFont() || {};
  const { theme, setTheme } = useTheme() || {};
  const { sideBarColor, setSideBarColor } = useSideBarColor() || {};
  const { navBarColor, setNavBarColor } = useNavBarColor() || {};
  const session = getSessionData();

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
      notifyInfo("Image selected. Click 'Save Image' to apply changes.");
    }
  };

  const getDataFromBackend = async () => {
    try {
      const response = await api.get('session-tutor/update-session/', {
        baseURL: API_BASE_URLS['Session_Service'],
        params: {
          session_code: session?.sessions?.session_code,
        },
      });
      setSettings(response.data);
    } catch (err) {
      notifyError('Failed to load settings. Please try again.');
    }
  };

  const saveChanges = async (field, value) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(field, value);
      await api.patch('session-tutor/update-session/', formData, {
        baseURL: API_BASE_URLS['Session_Service'],
        params: { session_code: session?.sessions?.session_code },
      });
      getDataFromBackend();
    } catch (error) {
      notifyError(`Failed to update ${field.replace('_', ' ')}`);
    }
    setIsSaving(false);
  };

  const saveImage = async () => {
    if (!imageFile) {
      notifyWarning('No image selected. Please choose an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setIsSavingImg(true);
      const response = await api.patch('session-tutor/update-session/', formData, {
        baseURL: API_BASE_URLS['Session_Service'],
        params: { session_code: session?.sessions?.session_code },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      notifySuccess('Session image updated successfully');
      setSettings(response.data);
    } catch (err) {
      notifyError('Failed to update session image');
    } finally {
      setIsSavingImg(false);
    }
  };

  const resetToDefaults = () => {
    setNavBarColor?.('#134E4A80');
    setSideBarColor?.('#1B4D4A');
    fontUpdateSettings?.('default');
    setTheme?.('dark');
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getDataFromBackend();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return {
    imageFile,
    imageUrl,
    setImageFile,
    setImageUrl,
    isRenewModal,
    setIsRenewModal,
    isSavingImg,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    isSaving,
    showPreview,
    setShowPreview,
    settings,
    updateSettings,
    handleFileChange,
    saveChanges,
    saveImage,
    resetToDefaults,
    fontSettings,
    fontClasses,
    fontUpdateSettings,
    theme,
    setTheme,
    navBarColor,
    setNavBarColor,
    sideBarColor,
    setSideBarColor,
  };
};
