import { useState } from "react";
import api from "../../../../Api/axios_api_call"

export default function ForgotPassword () {

    const [email, setEmail] = useState("");
    const forgot_paragraph = "Forgot your account’s password? Enter your email address and we’ll send you a recovery OTP."

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await api.post("auth-app/sample-request/", {email});
        } catch (error) {
            console.log('Error :', error);
        }
    };

    return (
        <>
        <div className="mb-4">
            <p className="text-black mb-3">{forgot_paragraph}</p>
           <label htmlFor="email" className="block text-sm font-bold text-gray-700">
            EMAIL</label>
             <input type="text" id="email" name="email" required value={email} autoComplete="on"
                onChange={(e) => {
                setEmail(e.target.value);}}  
                className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
        </div>
        <div className="mb-4 relative">
           
            <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
            Send Recovery Mail
            </button>

        </div>
        </>
    );
};