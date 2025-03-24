import React, { useEffect, useState } from 'react';
import { CreditCard, AlertCircle, Save, RefreshCw, Sun, Moon, Image, PenBoxIcon, XIcon } from 'lucide-react';
import { useFont } from '../../../../../context/FontContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { useSideBarColor } from '../../../../../context/SideBarColorContext';
import { useNavBarColor } from '../../../../../context/NavbarColorContext';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import RenewSubscription from './components/renewSubscription.jsx';

function Settings() {

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isRenewModal ,setIsRenewModal] = useState(false);
  const [isSavingImg, setIsSavingImg] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { fontSettings, fontUpdateSettings, fontClasses } = useFont() || {}; 
  const { theme, setTheme } = useTheme() || {};
  const { sideBarColor, setSideBarColor } = useSideBarColor() || {};
  const { navBarColor, setNavBarColor } = useNavBarColor() || {};

  const [settings, setSettings] = useState({});
  const session = getSessionData();

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getDataFromBackend = async () => {
   
    try{
      const response = await api.get('session-tutor/update-session/',{
        baseURL: API_BASE_URLS['Session_Service'],
        params: {
          session_code: session?.sessions?.session_code,
        },
      });
      setSettings(response.data)
      console.log("ASSESS :", response);
    } catch (err){
      console.error(err);
    }
  };

  const saveChanges = async (field, value) => {
    setIsSaving(true);
    console.log('CHANGE :',field, value);
    
    try {
      const formData = new FormData();
            formData.append(field, value);
      
      await api.patch('session-tutor/update-session/', formData, {
        baseURL: API_BASE_URLS['Session_Service'],
        params: { session_code: session?.sessions?.session_code,}
      });
      getDataFromBackend();
    } catch (error) {
      console.error('Error updating:', error);
    }
    setIsSaving(false);
  };

  const saveImage = async () => {
    if (!imageFile) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    
    try {
      setIsSavingImg(true);
      const response = await api.patch('session-tutor/update-session/', formData, {
        baseURL: API_BASE_URLS['Session_Service'],
        params: { session_code: session?.sessions?.session_code },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log("Image upload successful:", response.data);
      setSettings(response.data);
    } catch (err) {
      console.error("Error updating image:", err);
    } finally {
      setIsSavingImg(false);
    }
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
  }, [fetchFromBackend])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-5">
      
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#2A5956]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Days Left</h2>
            </div>
            <div className="text-left sm:text-right bg-[#17403D] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#00E08E]">{settings?.days_left} </div>
              <div className="text-sm text-gray-300">months</div>
            </div>
          </div>
          {settings?.days_left < 2 &&
          <button
             onClick={() => setIsRenewModal(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <CreditCard size={20} />
            Renew Subscription
          </button>
          }
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
      value={settings?.session_name  || ''}
      onChange={(e) => setSettings({ ...settings, session_name: e.target.value })}
      className="w-full bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    />
  ) : (
    <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
      {settings?.session_name}
    </p>
  )}

  {editName &&
  <button
    onClick={() => { if (editName) saveChanges('session_name', settings.session_name); setEditName(!editName); }}
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
                value={settings?.session_discription  || ''}
                onChange={(e) => setSettings({ ...settings, session_discription: e.target.value })}
                className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white h-24 border border-[#2A5956] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              :
              <p className="w-full bg-[#234E4B] rounded-lg px-4 py-3 text-white border border-[#2A5956]">
                {settings?.session_discription || 'no description available'}
              </p>
                }
              {editDescription &&
                <button
                onClick={() => { if (editDescription) saveChanges('session_discription', settings.session_discription); setEditDescription(!editDescription); }}
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
        <div className="bg-[#1B4D4A] rounded-lg p-6 shadow-lg border border-[#b0b6b5]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Appearance Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className='flex justify-between px-5'>
              <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Navbar Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={navBarColor  || ''}
                  onChange={(e) => setNavBarColor({ navbarColor: e.target.value })}
                  className="h-10 w-20 rounded cursor-pointer "
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
                    value={sideBarColor  || ''}
                    onChange={(e) =>  setSideBarColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />

              </div>
              </div>
              </div>
            

            
  
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Join Card Background Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl || settings.image || ''}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="add url or choose a image..."
                  className="flex-1 text-tiny bg-[#234E4B] rounded-lg px-4 py-2 text-white border border-[#2A5956] focus:border-emerald-500 focus:outline-none"
                />
                <div className='flex items-center'>
                  <input
                    type="file"
                    id="picture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="picture"><Image size={20} className="text-emerald-300 cursor-pointer" /></label>
                </div>
            </div>
            </div>
            <div className="bg-[#1B4D4A] rounded-lg p-6 space-y-2 shadow-lg border border-[#2A5956]">
              <div className='flex justify-between'>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm bg-[#17403D] hover:bg-[#123532] text-emerald-300 py-1 px-3 rounded-lg"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              <button 
                onClick={saveImage}
                className="text-sm bg-[#42b3ab] hover:bg-[#123532] text-slate-800 hover:text-teal-300  py-1 px-3 rounded-lg"
              >
                Save Image
              </button>
              </div>
            <div>
            {showPreview && (
  <div className="bg-[#0D2C2A] rounded-lg p-2 border border-[#2A5956]">
    <div className="text-center text-sm text-gray-300 mb-2">Preview</div>
    
    <div
      className="relative group rounded-xl border border-yellow-500 overflow-hidden h-40"
    >
      
      <div
        className="absolute  inset-0 bg-cover bg-center bg-slate-400"
        style={{ backgroundImage: `url(${imageUrl || settings.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
      
      <div className="relative p-2 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-xs font-medium">SESSION123</span>
          </div>
          <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-full text-xs">
            Sample Session
          </span>
        </div>
        
        <h3 className="text-white text-sm font-bold mb-2 group-hover:text-emerald-400 transition-colors">
          Sample Session Name
        </h3>
        
        <div className="space-y-1 mt-auto">
          <div className="flex items-center text-gray-300 text-xs">
            <span className='mr-1 text-rose-400 font-bold'>10</span><span>Days Left</span>
          </div>
          <div className="flex items-center text-gray-300 text-xs">
            <span>5 Students</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
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
    {isRenewModal &&
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30">
         <RenewSubscription cancelModal={() => setIsRenewModal(false)} />
      </div>
    }
  </div>
  );
}

export default Settings;