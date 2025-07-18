import { motion } from 'framer-motion';
import { BarChart, Target, Zap, DollarSign, Shield, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Teacher() {
   const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };
  return (
    <section id="tutor-benefits" className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
        Why Teach with StudyZed?
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Join our community of educators and make a difference while growing your
        tutoring business.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass p-6 rounded-xl">
          <Globe className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
          <p className="text-gray-400">
            Connect with students worldwide and expand your teaching impact
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Target className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
          <p className="text-gray-400">
            Most simpler tool that let you analyze your impact with the class
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Zap className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Powerful Tools</h3>
          <p className="text-gray-400">
            Access professional teaching tools and resources
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <DollarSign className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Live-Class and Chat</h3>
          <p className="text-gray-400">
            Interact with your students in Live Class and messages.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <BarChart className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Growth Analytics</h3>
          <p className="text-gray-400">
            Track your performance and student satisfaction metrics
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Shield className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
          <p className="text-gray-400">
            Protected payments and verified student profiles
          </p>
        </div>
      </div>
      <div className="mt-16 text-center">
        <motion.button
          onClick={handleLogin}
          className="px-6 py-3 bg-[#00FFB2] text-black font-semibold rounded-full hover:bg-[#1ed75c] transition"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          whileHover={{ scale: 1.5 }}
        >
          Join Study-zed?
        </motion.button>
      </div>
    </section>
  );
}
