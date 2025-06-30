import { useEffect } from 'react';
import Landingpageimage from '../../../assets/landingpageimage.png';
import XmasCap from '../../../assets/xmascap.png';
import {
  getSavedAuthData,
} from '../../../utils/Localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = getSavedAuthData();
      if (isAuthenticated) {
        navigate(`/${role.role.toLowerCase()}/choose-session/`);
      }
    } catch (error) {
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl  px-9">
      <div className="lg:ml-9 mt-6">
        <h1 className="text-6xl font-bold leading-tight">
          Learn,
          <br /> <span className="text-7xl">Grow,</span>
          <br /> <span className="text-8xl"> Succeed.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400">
          Learn from the best tutors, Teach with the best tools—
          <br /> StudyZen is here to support your journey.
        </p>
        <div className="mt-16 flex gap-6">
          <button className="default_button p-3">Start Learning</button>
          <button className="black_default_button p-3">I'm a Tutor</button>
        </div>
      </div>
      <div className="hidden mt-16 md:block">
        {/* <img src={XmasCap} className="absolute childhat"  
         alt="" /> */}
        <img
          src={Landingpageimage}
          alt="StudyZen Character Loading"
          className="max-w-sm"
        />
      </div>
    </div>
  );
};

export default LandingPage;
