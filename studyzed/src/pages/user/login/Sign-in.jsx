import { useState, useEffect } from "react";
import { Smile } from "lucide-react";
import Tutorlogin from "./steps/tutor";
import Studentlogin from "./steps/student";
import LoginPic from "../../../assets/loginpic.png";

export default function Signin (){
    const [student, setstudent] = useState(true)

    const handleTutorRole = () => {
      setstudent((prev) => !prev);
    };
    
    return (
        <>
        <div className="flex justify-center items-center min-h-screen ">
          <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg">
            <div className='bg-white  flex'>
      
              <div className="w-1/2 p-8">
                  <h2 className="text-2xl font-bold text-black text-center mb-6">Login</h2>
                  
                  <form>
                      
                  { student && <Studentlogin changeRole={handleTutorRole} /> }
                  { !student && <Tutorlogin changeRole={handleTutorRole} /> }

                  </form>
              </div>

              <div className="w-1/2 flex rounded items-center justify-center bg-gray-100">
                <div className='w-[95%] h-[95%] bg-white rounded p-1'>
                  <img 
                      src={ LoginPic } 
                      alt="Placeholder" 
                      className="object-cover rounded h-full w-full"
                  />
                </div>
              </div>

          </div>
        </div>
      </div>
    </>
    )
};

