import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const CustomToast = ({ closeToast, message, icon }) => (
  <div className="flex items-start gap-3 min-w-[300px]">
    <div className="flex-shrink-0 mt-1">
      {icon}
    </div>
    <div className="flex-1">
      {message}
    </div>
    <button onClick={closeToast} className="flex-shrink-0 text-gray-400 hover:text-white transition-colors">
      <X size={18} />
    </button>
  </div>
);

export const notifySuccess = (message) => toast.success(
  ({ closeToast }) => (
    <CustomToast 
      closeToast={closeToast}
      message={message} 
      icon={<CheckCircle size={20} className="text-emerald-300" />} 
    />
  ),
  { icon: false }
);

export const notifyError = (message) => toast.error(
  ({ closeToast }) => (
    <CustomToast 
      closeToast={closeToast}
      message={message} 
      icon={<AlertCircle size={20} className="text-red-400" />} 
    />
  ),
  { icon: false }
);

export const notifyInfo = (message) => toast.info(
  ({ closeToast }) => (
    <CustomToast 
      closeToast={closeToast}
      message={message} 
      icon={<Info size={20} className="text-blue-400" />} 
    />
  ),
  { icon: false }
);

export const notifyWarning = (message) => toast.warning(
  ({ closeToast }) => (
    <CustomToast 
      closeToast={closeToast}
      message={message} 
      icon={<AlertTriangle size={20} className="text-yellow-300" />} 
    />
  ),
  { icon: false }
);

export const CustomToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={4000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    className="mt-16" 
    toastClassName={() => 
      "bg-[#17403D] text-white rounded-lg shadow-lg border border-[#2A5956] p-4 mb-3 cursor-pointer"
    }
    progressClassName={() => 
      "Toastify__progress-bar Toastify__progress-bar--animated bg-emerald-400"
    }
    closeButton={false} 
  />
);