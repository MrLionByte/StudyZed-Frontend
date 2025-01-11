import Emailstep from './steps/email.jsx';
import Otpstep from './steps/otpstep.jsx';
import Userdetailstep from './steps/userdetails.jsx';
import { useState, useEffect } from 'react';
import Registration_pic from '../../../assets/registration_form.png';
import { useNavigate } from 'react-router-dom';
import StepProgressBar from './Progress.jsx';
import GoogleAuthApp from '../../../utils/GoogleAuth.jsx';
import { Mosaic } from 'react-loading-indicators';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../api/helpers/constrands.js';
import { useSelector } from 'react-redux';
import { getSavedAuthData } from '../../../utils/Localstorage.js';


export default function Signup() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated);
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
        
        // const role = getSavedAuthData(); 
        // if (isAuthenticated) {
        //     navigate(`/${role.role.toLowerCase()}/choose-session/`);
        // }
    }, []);

    const handleLoginSuccess = () => {

    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex w-full max-w-3xl h-[500px] bg-white rounded-md shadow-lg overflow-hidden">
              
                <div className="w-1/2 flex rounded p-2 bg-white">
                    <div className="bg-gray-200 rounded w-full h-full flex items-end">
                        <img
                            src={Registration_pic}
                            alt="Placeholder"
                            className="object-cover rounded h-auto w-full"
                        />
                    </div>
                </div>

               
                <div className="w-1/2 p-8 justify-center content-center">
                    <div className="text-black mb-5">
                        <h2 className="text-4xl font-bold">Get Started</h2>
                    </div>
                    <StepProgressBar progress={currentStep} />
                    {loading ? (
                     
                        <div className="flex justify-center items-center h-40">
                            <Mosaic color="#32cd32" size="medium" text="" textColor="" />
                        </div>
                    ) : (
                       
                        <form>
                            {currentStep === 1 && <Emailstep onNext={nextStep} />}
                            {currentStep === 2 && <Otpstep onNext={nextStep} onBack={prevStep} />}
                            {currentStep === 3 && (
                                <Userdetailstep NextToSignin={handleSignin} onBack={prevStep} />
                            )}
                        </form>
                    )}
                    
                     {/* <GoogleAuthApp onLoginSuccess={handleLoginSuccess} /> */}
                </div>
            </div>
        </div>
    );
}
