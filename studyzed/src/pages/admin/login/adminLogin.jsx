import { useState, useEffect } from "react";
import LoginComponent from './components/loginform.jsx';
import { useNavigate } from "react-router-dom";

export default function AdminLogin (){    
    return (
        <div className="flex items-center justify-center">
          <LoginComponent />
        </div>
    )
};

