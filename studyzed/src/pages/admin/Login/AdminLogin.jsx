import { useState, useEffect } from "react";

export default function AdminLogin (){

    console.log("ADMIN WORKING");
    
    
    return (
        <>
        <div className="flex justify-center items-center min-h-screen bg-black">
          <div className="flex w-full max-w-3xl bg-red-500 rounded-lg shadow-lg">
              <div className="w-1/2 p-8">
                <h2 className="text-2xl font-bold text-black text-center mb-6">
                    Login</h2>
                <form>
                    tudy
                    <input type="text" placeholder="email/username"/>
                    <input type="password" placeholder="password"/>
                    <button type="submit">SUBMIT</button>

                </form>
              </div>
        </div>
      </div>
    </>
    )
};

