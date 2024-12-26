import { useState, useEffect } from "react";
import LoginComponent from './components/loginform.jsx';

export default function AdminLogin (){

    console.log("ADMIN WORKING");
    
    
    return (
        <div className="flex items-center justify-center">
          <LoginComponent />
        </div>
    )
};

