import { useState } from 'react';
import { GraduationCap, Menu, UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/studyzed_main.png'

export default function Navbar({logout, userProfile}) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

    const handleLogout = () => {
    logout()
    setShowAccountMenu(false)
       
    }

    const handleUserProfile = () => {
        userProfile()
        setShowAccountMenu(false)
    }

  return (
    <nav className="bg-teal-900/50 backdrop-blur-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 align-middle">
            <GraduationCap className="h-8 w-8 text-emerald-400" />
            <img className="size-1/4 mt-2" src={Logo} alt="Logo" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/student/choose-session" className="hover:text-emerald-400">Home</Link>
            <Link to="/wallet" className="hover:text-emerald-400">Wallet</Link>
            <button 
              className="p-2 hover:bg-teal-800 rounded-full relative"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <UserCircle className="h-6 w-6 text-emerald-400" />
            </button>

           {showAccountMenu && (
              <div className="absolute right-4 top-16 w-48 py-2 bg-teal-900/95 backdrop-blur-sm rounded-lg shadow-xl z-50">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-teal-800 transition-colors"
                  onClick={handleUserProfile} 
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                
                <button 
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-teal-800 transition-colors text-red-400"
                  onClick={handleLogout} 
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}