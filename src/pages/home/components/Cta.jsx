import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function FAQ() {
   const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="glass rounded-2xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-6 gradient-text">
          Ready to Transform Your Learning Journey?
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of students and tutors who are already experiencing the
          future of personalized education.
        </p>
        <button
          onClick={handleLogin} 
          className="px-8 py-4 btn-primary rounded-lg inline-flex items-center"
          >
          Get Started Now <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </section>
  );
}
