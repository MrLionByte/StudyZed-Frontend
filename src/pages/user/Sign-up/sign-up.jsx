import EmailStep from './steps/email.jsx';
import OtpStep from './steps/otpstep.jsx';
import UserDetailStep from './steps/userdetails.jsx';
import { useState, useEffect } from 'react';
import Registration_pic from '../../../assets/registration_form.png';
import Details_Registration from '../../../assets/loginpssssic.png';
import { useNavigate } from 'react-router-dom';
import { FourSquare } from 'react-loading-indicators';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../../api/helpers/constrands.js';
import * as ProgressPrimitive from '@radix-ui/react-progress';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const handleSignin = () => {
    navigate('/login');
  };

  const nextStep = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentStep((prev) => prev + 1);
    setLoading(false);
  };

  const prevStep = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentStep((prev) => prev - 1);
    setLoading(false);
  };

  useEffect(() => {
    const savedStep = localStorage.getItem('signup-step');
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      setProgress(5);
    } else if (currentStep === 2) {
      setProgress(50);
    } else if (currentStep === 3) {
      setProgress(95);
    } else {
      setProgress(0);
    }
  }, [currentStep]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg md:p-5 rounded-2xl md:w-[800px] md:h-[570px] md:flex gap-8">
        <div className="hidden md:flex-1 md:justify-center items-end md:bg-opacity-10 md:bg-slate-400 md:rounded-xl md:overflow-hidden md:block relative">
          {currentStep != 3 ? (
            <img
              src={Registration_pic}
              alt="Study"
              className="absolute bottom-[-10%] left-1/2 transform 
                    -translate-x-1/2 scale-100 object-cover"
            />
          ) : (
            <img
              src={Details_Registration}
              alt="Study"
              className="absolute bottom-[-0%] left-1/2 transform 
                    -translate-x-1/2 scale-100 object-cover"
            />
          )}
        </div>
        <div className="md:w-1/2 p-8 content-center">
          <div className="text-white mb-5">
            {currentStep === 1 ? (
              <h2 className="text-4xl font-bold text-center">Sign up</h2>
            ) : currentStep === 2 ? (
              <h5 className="text-3xl font-bold text-center">Verify</h5>
            ) : (
              <>
                <h5 className="text-2xl font-bold text-center">
                  Learn, Grow, Succeed
                </h5>
                <p className="text-md font mt-2 text-gray-400">
                  Finish your step and be a part of StudyZed
                </p>
              </>
            )}

            <div className="p-2 mt-5">
              <style>
                {`@keyframes progress {
            to {
              left: calc(100% - 2rem);
            }
          }
          .progress {
            transform-origin: center;
            animation: progress 1.25s ease-in-out infinite;
          }
          `}
              </style>
              <ProgressPrimitive.Root className="relative h-2 min-w-full overflow-hidden rounded-full bg-gray-400">
                <ProgressPrimitive.Indicator
                  className="relative h-full rounded w-full flex-1 bg-emerald-400 transition-all"
                  style={{
                    transform: `translateX(-${100 - (progress || 0)}%)`,
                  }}
                >
                  <div className="absolute left-0 w-9 h-full bg-gray-700 blur-[9px] inset-y-0 progress" />
                </ProgressPrimitive.Indicator>
              </ProgressPrimitive.Root>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FourSquare color="#66B380" size="medium" text="" textColor="" />
            </div>
          ) : (
            <div>
              {currentStep === 1 && <EmailStep onNext={nextStep} />}
              {currentStep === 2 && (
                <OtpStep onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 3 && (
                <UserDetailStep NextToSignin={handleSignin} onBack={prevStep} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
