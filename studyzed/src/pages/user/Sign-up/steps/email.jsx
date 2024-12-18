import { useEffect, useState } from "react";
import api from "../../../../Api/axios_api_call";
import { useNavigate } from "react-router-dom";


export default function emailstep ( {onNext} ) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("Temp_email");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email){alert("Please enter a valid email")}
        else {
            if (!validateEmail(email)) {
                setError('Please enter a valid email address.');
                return;
            }
            try {
                const response = await api.post('auth-app/user-email/', {email}); 
                console.log('RESPONSE :', response);
                console.log('RESPONSE :', response['auth-status']);
                console.log("Browser cookies:", document.cookie);
                localStorage.setItem('Temp_email', email);
                
                if (response.data['auth-status'] === 'success' && response.status === 200){
                onNext(); }
                else {
                    alert('Failed to send OTP. Please try again.');
                }
            }
            catch (error){
                console.log('ERROR :', error)
                if ((error.response.data['error'])==="Invalid data"){
                    alert("Email is already in use. Please try with a different email address")
                }else {
                alert(error.response.data['error'])
            }
                throw error
            }
        }     
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
    
    
    const handleSignin = () => {
        navigate('//log-in/'); 
    }

    return (
        <>
        <div className="mt-5">
            <div className="mb-4">
               <label htmlFor="username" className="block text-sm font-medium text-gray-700">EMAIL</label>
                 <input type="text" id="email" name="email" required value={email} placeholder="Enter your Email"
                    onChange={(e) => {
                    setEmail(e.target.value); localStorage.setItem('Temp_email', e.target.value); }}  
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
            </div>
            <button 
                type="submit" onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
                > Verify Email </button>
            <p className="text-black mt-5">Already have account ? 
                <span className="text-red-600 cursor-pointer hover:underline" onClick={handleSignin}>/log-in</span>
            </p>
        </div>
        </>
    )
}