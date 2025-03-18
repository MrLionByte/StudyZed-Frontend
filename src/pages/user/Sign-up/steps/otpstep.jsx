import { useEffect, useState } from 'react';
import api from '../../../../api/axios_api_call';
import OTP_fields from '../../../../components/OTP_fields';
import { toast, ToastContainer } from 'react-toastify';

export default function OtpStep({ onNext, onBack }) {
  const [otp, setOtp] = useState('');
  const [timeout, setTimeout] = useState(5000); //seconds

  useEffect(() => {
    const storeTime = localStorage.getItem('otp-expire-timer');
    if (storeTime) {
      const timeRemaining = parseInt(storeTime, 10) - Date.now();
      if (timeRemaining > 0) {
        setTimeout(Math.floor(timeRemaining / 1000));
      } else {
        setTimeout(0);
        localStorage.removeItem('otp-expire-timer');
      }
    } else {
      const expireTime = Date.now() + 5 * 60 * 1000;
      localStorage.setItem('otp-expire-timer', expireTime.toString());
    }

    const timerInterval = setInterval(() => {
      setTimeout((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timerInterval);
          localStorage.removeItem('otp-expire-timer');
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const validateOTP = (otp) => {
    return /^[0-9]{6}$/.test(otp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.warning('OTP cannot be empty.');
      return;
    }
    if (!validateOTP(otp)) {
      toast.warning('Please enter a valid 6-digit OTP.');
      return;
    }
    try {
      const email = localStorage.getItem('Temp_email');
      const response = await api.post('auth-app/verify-otp/', { email, otp });

      if (
        response.data['auth-status'] === 'success' &&
        response.status === 200
      ) {
        localStorage.setItem('signup-step', 3);
        onNext();
      } else {
        toast.error('Failed to verify OTP.', response.data['message']);
      }
    } catch (error) {
      if (error.status == 400) {
        toast.error('Failed to verify OTP.OTP incorrect.');
      } else {
        toast.error('Error occured ,please try again');
      }
      throw error;
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('Temp_email');
      const response = await api.post('auth-app/resend-otp/', { otp, email });

      if (
        response.data['auth-status'] === 'resend' &&
        response.status === 200
      ) {
        localStorage.setItem('signup-step', 2);
        setTimeout(5000);
        toast.success('OTP  resend successfully', response.data['message']);
      } else {
        toast.error('Failed to send OTP.', response.data['message']);
      }
    } catch (error) {
      toast.error('Failed to resend OTP, try again after sometime.');
      throw error;
    }
  };

  const handleBack = () => {
    localStorage.removeItem('Temp_email');
    localStorage.removeItem('signup-step');
    onBack();
  };

  const getOTP = (otpString) => {
    setOtp(otpString);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex-1">
      <p className="text-sm text-gray-300 mb-6 mt-3">
        Welcome to StudyZed! Let's begin your journey
      </p>

      <div className="space-y-4">
        <div>
          <p className="text-white">Enter OTP here :</p>
          <div className="mb-4 gap-2 flex items-center justify-center">
            <OTP_fields otp_entered={getOTP} />
          </div>
          {timeout > 0 ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 font-bold bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4"
            >
              {' '}
              Confirm OTP
            </button>
          ) : (
            <>
              <button
                type="submit"
                onClick={handleResendOtp}
                className="w-full py-3 font-bold bg-emerald-600 text-black rounded-lg hover:bg-emerald-300 transition-colors mb-4"
              >
                {' '}
                Resend OTP
              </button>
            </>
          )}

          <div className="text-center text-sm text-slate-400 p-2 font-semibold">
            {timeout > 0 ? (
              <p>Time Remaining: {formatTime(timeout)}</p>
            ) : (
              <p className="text-red-600">OTP Expired!</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <a
          href=""
          className="text-center p-2 hover:text-emerald-400"
          onClick={handleBack}
        >
          Want to change email ?
        </a>
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}
