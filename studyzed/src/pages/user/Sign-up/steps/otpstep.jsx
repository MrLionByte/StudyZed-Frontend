import { useEffect, useState } from "react";
import api from "../../../../Api/axios_api_call";

export default function otpstep ({onNext, onBack}) {
    const [otp, setOtp] = useState("");
    
    useEffect(() => {
    
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp){alert("Please enter a valid OTP")}
        else {
            if (!validateOTP(otp)) {
                setError('Please enter a valid OTP.');
                return;
            }
            try {
                const email = localStorage.getItem("Temp_email");
                const response = await api.post('auth-app/verify-otp/', {otp, email}); 
                console.log('RESPONSE :', response);
                
                if (response.data['auth-status'] === 'success' && response.status === 200){
                    localStorage.setItem("signup-step", 3);
                    onNext(); }
                    else {
                        alert("Failed to verify OTP.", response.data['message']);
                    }                
            }
            catch (error){
                console.log('ERROR :', error)
                alert(error)
                throw error
            }
        }     
    };

    const handleBack = () => {
        localStorage.removeItem("Temp_email");
        localStorage.removeItem("signup-step");
        onBack();
    }

    const validateOTP = (otp) => {
            const OTP_validation = Number(otp);
            return !isNaN(OTP_validation) && Number.isInteger(OTP_validation);
          };

    return (
            <>
            <div className="mt-5">
                <div className="mb-4 gap-2 flex items-center justify-center">
                   {/* <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label> */}
                     <input type="text" id="otp" name="text" required value={otp} placeholder="Enter OTP"
                        onChange={(e) => {
                        setOtp(e.target.value); }}  
                        className="mt-1 block w-1/2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                        />
                </div>
                <button 
                    type="submit" onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
                    > Confirm OTP </button>
                <div className="mt-5">
                <a href="" className="text-black p-2" onClick={handleBack}> Want to change email ? </a>
                </div>
            </div>
            </>
    )
}