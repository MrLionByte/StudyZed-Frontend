import React from "react";
import Logo from "../assets/StudyZen_Logo.png"
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('sign-in/')
  }

  const handlesignup = () => {
    navigate('sign-up/')
  }

  const handleTohome = () => {
    navigate('/')
  };

  return (
    <nav className="flex justify-between items-center px-6 py-5 ">
      <div className="flex items-center" onClick={handleTohome}>
            <img className="max-w-8" src={ Logo } alt="" />
            <div className="text-2xl font-bold">StudyZen</div>
      </div>
      <div className="hidden md:flex gap-8">
        <a href="#home" className="hover:text-teal-400">
          Home
        </a>
        <a href="#about" className="hover:text-teal-400">
          About Us
        </a>
        <a href="#faq" className="hover:text-teal-400">
          FAQ
        </a>
      </div>
      <div className="flex gap-4">
        <a
          onClick={handlesignup}
          className="px-4 py-2  rounded-md hover:bg-teal-400 hover:text-black"
        >
          Sign up
        </a>
        <a
        onClick={handlelogin}
          className="px-4 py-2 rounded-md hover:bg-teal-500  hover:text-black"
          >
          Log In
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
