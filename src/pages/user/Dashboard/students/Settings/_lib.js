import { useEffect, useState } from 'react';
import { useFont } from '../../../../../context/FontContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { useSideBarColor } from '../../../../../context/SideBarColorContext';
import { useNavBarColor } from '../../../../../context/NavbarColorContext';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';

export function useSettingsLogic() {
  const [isSaving, setIsSaving] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [settings, setSettings] = useState({});

  const { fontSettings, fontUpdateSettings, fontClasses } = useFont() || {};
  const { theme, setTheme } = useTheme() || {};
  const { sideBarColor, setSideBarColor } = useSideBarColor() || {};
  const { navBarColor, setNavBarColor } = useNavBarColor() || {};

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getDataFromBackend = async () => {
    const session = getSessionData();
    try {
      const response = await api.get('session-student/session-details/', {
        baseURL: API_BASE_URLS['Session_Service'],
        params: {
          session_code: session?.sessions?.session_code,
        },
      });
      setSettings(response.data[0]);
    } catch (err) {
      // console.error(err);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const resetToDefaults = () => {
    setNavBarColor('#134E4A80');
    setSideBarColor('#1B4D4A');
    fontUpdateSettings('default');
    setTheme('dark');
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getDataFromBackend();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  return {
    settings,
    isSaving,
    fontSettings,
    fontUpdateSettings,
    fontClasses,
    theme,
    setTheme,
    sideBarColor,
    setSideBarColor,
    navBarColor,
    setNavBarColor,
    handleSave,
    resetToDefaults,
  };
}
