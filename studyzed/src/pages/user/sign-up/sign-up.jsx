import Emailstep from './steps/email.jsx'
import Otpstep from './steps/otpstep.jsx'
import Userdetailstep from './steps/userdetails.jsx'
import { useState, useEffect } from 'react'
import Registration_pic from '../../../assets/registration_form.png'
import { useNavigate } from 'react-router-dom'
import StepProgressBar from './Progress.jsx'
import GoogleAuthApp from '../../../utils/GoogleAuth.jsx'


export default function signup () {
    const [currentstate, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const nextStep = () => setCurrentStep((prev)=> prev + 1);
    const prevStep = () => setCurrentStep((prev)=> prev - 1);
    console.log("NEXT :",nextStep, "PREV :",prevStep, "CURRENT :",currentstate);

    const handlesignin = () => {
        navigate('/sign-in/'); 
    }

    // const onLoginSuccess = () => {
    //   setCurrentStep(3);
    // }

    useEffect(() => {
        const savedStep = localStorage.getItem("signup-step");
        if (savedStep) {
          setCurrentStep(Number(savedStep));
        }
      }, []);

    return (
        <div className="flex justify-center items-center min-h-screen ">
          <div className="flex w-full max-w-3xl h-[500px] bg-white rounded-md shadow-lg overflow-hidden">
            <div className='bg-white  flex'>
            
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
                <div className='text-black mb-5'>
                  <h2 className='text-4xl font-bold'>Get Started</h2>
                </div>
                    <StepProgressBar progress={currentstate} />
                <form className="">            
                    { currentstate === 1 && <Emailstep onNext={nextStep} /> }
                    { currentstate === 2 && <Otpstep onNext={nextStep} onBack={prevStep} /> }
                    { currentstate === 3 && <Userdetailstep NextToSignin={handlesignin} onBack={prevStep} /> }
                </form>

                  {/* <GoogleAuthApp onLoginSuccess={handleLoginSuccess} /> */}

              </div>
            </div>
          </div>
        </div>
    )
};