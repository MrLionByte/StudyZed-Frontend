import { useEffect, useState } from "react";

export default function OTP_fields({otp_entered}){
    const [otp, setOtp] = useState(["","","","","",""]);

    useEffect(() => {
        if (otp.every(value => value !== "")){
            otp_entered(otp.join(""));
        }
    }, [otp, otp_entered]);
    
    const handleChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
          }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && otp[index] === "") {
          if (index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
          }
        }
    };

    return (
        <div className="flex space-x-2">
        {otp.map((value, index) => (
          <input type="text" 
            id={`otp-${index}`} 
            key={index}
            maxLength={1}
            name={`otp-${index}`}
            required 
            value={value} 
            onChange={(e) => {
            handleChange(index, e.target.value);}}  
            onKeyDown={(e)=> {
                handleKeyDown(index, e);
            }}
           className="mt-1 block w-1/2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
        ))}
        </div>
    );
};