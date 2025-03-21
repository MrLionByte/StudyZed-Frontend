import React, { useEffect, useState } from 'react';
import { CreditCard, AlertCircle, Save, RefreshCw, Sun, Moon, Image, PenBoxIcon, XIcon } from 'lucide-react';
import { useFont } from '../../../../../context/FontContext';
import { useTheme } from '../../../../../context/ThemeContext';
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

  const [settings, setSettings] = useState({
    sessionName: 'ASWSA-F766DC',
    description: 'Learn, Grow, Succeed',
    navbarColor: '#051F1E',
    navbarImage: '',
    joinCardBgImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2400',
    theme: 'dark',
    notificationsEnabled: true,
    fontStyle: 'default',
  });
  
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
      // setSettings(response.data[0])
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
    setSettings({
      sessionName: 'ASWSA-F766DC',
      description: 'Learn, Grow, Succeed',
      navbarColor: '#051F1E',
      navbarImage: '',
      joinCardBgImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2400',
      theme: 'dark',
      notificationsEnabled: true,
      fontStyle: 'default',
    });
  };

  useEffect(()=>{
    if (fetchFromBackend){
      getDataFromBackend();
      setFetchFromBackend(false);
    }
  })

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
  {editName ? (
    <input
      type="text"
      value={settings.sessionName}
      onChange={(e) => updateSettings({ sessionName: e.target.value })}
      className="w-full bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    />
  ) : (
    <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
      A unique identifier for your session. This helps others identify and join your study sessions.
    </p>
  )}

  {editName &&
  <button
    onClick={() => setEditName(!editName)}
    className="bg-emerald-500 hover:bg-blue-600  text-white p-2 rounded-lg transition-colors flex items-center justify-center"
  >
    <Save />
  </button>
  }
  <button
    onClick={() => setEditName(!editName)}
    className={`${!editName ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600' }  text-white p-2 rounded-lg transition-colors flex items-center justify-center`}
  >
    {editName? <XIcon /> : <PenBoxIcon />}
  </button>
  
</div>
</div>

  
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <div className="flex items-center gap-2">
                {editDescription ? 
              <textarea
                value={settings.description}
                onChange={(e) => updateSettings({ description: e.target.value })}
                className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white h-24 border border-[#2A5956] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              :
              <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
                {settings.session_discription || 'no description available'}
              </p>
                }
              {editDescription &&
                <button
                  onClick={() => setEditDescription(!editDescription)}
                  className="bg-emerald-500 hover:bg-blue-600  text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Save />
                </button>
                }
              <button
                  onClick={() => setEditDescription(!editDescription)}
                  className={`${!editDescription ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600' }  text-white p-2 rounded-lg transition-colors flex items-center justify-center`}
                >
                  {editDescription? <XIcon /> : <PenBoxIcon />}
              </button>
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
                  {Object?.keys(fontClasses || {})?.map((key) => (
                      <option key={key} value={key}>
                        {key?.charAt(0)?.toUpperCase() + key?.slice(1)}
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
                Navbar Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.navbarColor}
                  onChange={(e) => updateSettings({ navbarColor: e.target.value })}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.navbarColor}
                  onChange={(e) => updateSettings({ navbarColor: e.target.value })}
                  className="flex-1 bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Join Card Background Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.joinCardBgImage}
                  onChange={(e) => updateSettings({ joinCardBgImage: e.target.value })}
                  placeholder="add url or choose a image..."
                  className="flex-1 bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                />
                <div className='flex items-center'>
                  <input
                    type='file'
                    id='picture'
                    className="bg-[#17403D] hover:bg-[#123532] rounded-lg hidden s"
                    title="Select Image"
                  />
                  <label htmlFor="picture"><Image size={20} className="text-emerald-300 cursor-pointer" /></label>
                </div>
                
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