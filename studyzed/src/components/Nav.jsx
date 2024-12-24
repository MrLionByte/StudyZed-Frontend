import React, { useState } from "react";
import Logo from "../assets/studyzed_main.png"
import { useNavigate } from "react-router-dom";
import XmasCap from '../assets/xmascap.png';
import './style/nav.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('login/')
  }

  const handlesignup = () => {
    navigate('sign-up/')
  }

  const handleTohome = () => {
    navigate('/')
  };

  return (
    <nav className="flex justify-between items-center px-6 py-5">
    {/* Logo */}
    <div className="flex items-center max-w-40 cursor-pointer" onClick={handleTohome}>
      {/* <img src={XmasCap} className="cap size-6 scale-x-[-1] z-10 mb-7 absolute"
      style={{ marginLeft: '145px', transform: 'rotate(40deg) scaleX(-1)' }} alt="" /> */}
      <img className="size-fit" src={Logo} alt="Logo" />
    </div>

    {/* Hamburger Menu (Mobile) */}
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white focus:outline-none">
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>
    </div>

    {/* Menu Links (Desktop) */}
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

    {/* Sign Up and Log In Buttons */}
    <div className="hidden md:flex gap-4">
      <a
        onClick={handlesignup}
        className="px-4 py-2 rounded-md hover:bg-teal-400 hover:text-black cursor-pointer"
      >
        Sign up
      </a>
      <a
        onClick={handlelogin}
        className="px-4 py-2 rounded-md hover:bg-teal-500 hover:text-black cursor-pointer"
      >
        Log In
      </a>
    </div>

    {/* Mobile Menu */}
    {isOpen && (
      <div className="absolute top-20 left-0 w-full bg-slate-400 flex flex-col gap-4 items-center md:hidden shadow-lg">
        <a href="#home" className="hover:text-teal-400 py-2">
          Home
        </a>
        <a href="#about" className="hover:text-teal-400 py-2">
          About Us
        </a>
        <a href="#faq" className="hover:text-teal-400 py-2">
          FAQ
        </a>
        <a
          onClick={handlesignup}
          className="px-4 py-2 rounded-md hover:bg-teal-400 hover:text-black cursor-pointer"
        >
          Sign up
        </a>
        <a
          onClick={handlelogin}
          className="px-4 py-2 rounded-md hover:bg-teal-500 hover:text-black cursor-pointer"
        >
          Log In
        </a>
      </div>
    )}
  </nav>
  );
};

export default Navbar;
