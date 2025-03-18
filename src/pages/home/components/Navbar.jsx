import { useEffect, useState } from 'react';
import Landingpageimage from '../../../assets/landingpageimage.png';
import XmasCap from '../../../assets/xmascap.png';
import {
  clearSavedAuthData,
  getSavedAuthData,
} from '../../../utils/Localstorage';
import { logout } from '../../../redux/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('login/');
  };

  const handlesignup = () => {
    navigate('sign-up/');
  };

  const handleTohome = () => {
    navigate('/');
  };

  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="text-[#00FFB2] w-8 h-8" />
          <span className="text-3xl font-bold ml-2 gradient-text">
            Study-Zed
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-300 hover:text-[#00FFB2] transition">
            Home
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-[#00FFB2] transition"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:text-[#00FFB2] transition"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-gray-300 hover:text-[#00FFB2] transition"
          >
            Contact
          </a>
          <a
            href="#faq"
            className="text-gray-300 hover:text-[#00FFB2] transition"
          >
            FAQ
          </a>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <button
            onClick={handlelogin}
            className="px-4 py-2 text-md glass rounded-lg hover:bg-white/10 transition"
          >
            Sign In
          </button>
          <button
            onClick={handlesignup}
            className="px-4 py-2 text-md btn-primary rounded-lg"
          >
            Get Started
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="absolute top-20 left-0 w-full bg-slate-400 bg-opacity-75 flex flex-col 
                gap-4 items-center md:hidden shadow-lg p-3 rounded-md"
        >
          <button
            onClick={handlesignup}
            className="px-4 py-2 w-full btn-primary text-md rounded-lg hover:bg-teal-500 
                        cursor-pointer"
          >
            Get Started
          </button>
          <button
            onClick={handlelogin}
            className="px-4 py-2 w-full rounded-md text-md  glass hover:bg-white/50 hover:text-black transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
