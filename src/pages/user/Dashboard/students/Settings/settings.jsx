import React, { useEffect, useState } from 'react';
import { CreditCard, AlertCircle, Save, RefreshCw, Sun, Moon, Image, PenBoxIcon, XIcon } from 'lucide-react';
import { useFont } from '../../../../../context/FontContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { useSideBarColor } from '../../../../../context/SideBarColorContext';
import { useNavBarColor } from '../../../../../context/NavbarColorContext';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';

function Settings() {
  const daysLeft = 30;
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const { fontSettings, fontUpdateSettings, fontClasses } = useFont() || {}; 
  const { theme, setTheme } = useTheme() || {};
  const { sideBarColor, setSideBarColor } = useSideBarColor() || {};
  const { navBarColor, setNavBarColor } = useNavBarColor() || {};

  const [settings, setSettings] = useState({});
  
  
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const getDataFromBackend = async () => {
    const session = getSessionData();
    try{
      const response = await api.get('session-student/session-details/',{
        baseURL: API_BASE_URLS['Session_Service'],
        params: {
          session_code: session?.sessions?.session_code,
        },
      });
      setSettings(response.data[0])
      console.log("ASSESS :", response);
    } catch (err){
      console.error(err);
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

  useEffect(()=>{
    if (fetchFromBackend){
      getDataFromBackend();
      setFetchFromBackend(false);
    }
  })
  console.log(settings);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-5">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#2A5956]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Session Duration</h2>
                {/* <p className="text-emerald-300">Premium Plan</p> */}
              </div>
              <div className="text-left sm:text-right bg-[#17403D] p-4 rounded-lg">
                <div className="text-2xl font-bold text-[#00E08E]">{settings.session_duration} </div>
                <div className="text-sm text-gray-300">months</div>
              </div>
            </div>
            {/* <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <CreditCard size={20} />
              Renew Subscription
            </button> */}
          </div>
          
          <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#2A5956]">
            <h2 className="text-xl font-semibold mb-4">Session Settings</h2>
            
            <div className="space-y-4">
            <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">
    Session Name
  </label>
  
  {/* Flex container to align input/text with button */}
  <div className="flex items-center gap-2">
    
      <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
       {settings.session_name || 'no name available'}
      </p>
    
  </div>
</div>

    
              <div>

                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <div className="flex items-center gap-2">
                  
                <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
                  {settings.session_discription || 'no description available'}
                </p>
                
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Font Style
                  </label>
                  <select
                    value={fontSettings?.fontStyle || 'default'}
                    onChange={(e) => fontUpdateSettings?.({ fontStyle: e.target.value })}
                    className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                  >
                    {Object.keys(fontClasses).map((key) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#2A5956]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Appearance Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  NavBar Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={navBarColor}
                    onChange={(e) =>  setNavBarColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={navBarColor}
                    onChange={(e) =>  setNavBarColor(e.target.value)}
                    className="flex-1 bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  SideBar Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={sideBarColor}
                    onChange={(e) =>  setSideBarColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={sideBarColor}
                    onChange={(e) =>  setSideBarColor(e.target.value)}
                    className="flex-1 bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
    
    
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Theme
                </label>
                <div className="flex gap-2">
                <button 
                  onClick={() => setTheme("dark")}
                  className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                    theme === "dark" 
                      ? "bg-[#17403D] border-emerald-500 text-emerald-300" 
                      : "bg-[#234E4B] border-[#2A5956] text-gray-300"
                  }`}
                >
                  <Moon size={18} />
                  Dark
                </button>

                <button 
                  onClick={() => setTheme("light")}
                  className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                    theme === "light" 
                      ? "bg-[#17403D] border-emerald-500 text-emerald-300" 
                      : "bg-[#234E4B] border-[#2A5956] text-gray-300"
                  }`}
                >
                  <Sun size={18} />
                  Light
                </button>
                </div>
              </div>

            </div>
          </div>
          
          {/* Save Changes */}
          <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#2A5956]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertCircle size={20} />
                <span>Changes are saved automatically</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={resetToDefaults}
                  className="flex-1 sm:flex-initial bg-[#17403D] hover:bg-[#123532] text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;