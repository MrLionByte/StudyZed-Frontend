import { CheckCircle } from 'lucide-react';
import Teaching from '../../../assets/learnn.png';

export default function About() {
  return (
    <section id="about" className="container mx-auto px-6 py-20 bg-black/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
          About StudyZed
        </h2>
        <p className="text-gray-400 text-center mb-12">
          We're revolutionizing education by connecting passionate educators and
          let them provide most personalized learning experience .
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-400 mb-6">
              To make quality education accessible to everyone by creating a
              platform that brings together the best tutors and students in an
              interactive, engaging learning environment.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle className="text-[#00FFB2] mr-3" size={20} />
                <span className="text-gray-400">
                  Personalized learning experiences
                </span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-[#00FFB2] mr-3" size={20} />
                <span className="text-gray-400">
                  Easy to use and Easy to familiarize
                </span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-[#00FFB2] mr-3" size={20} />
                <span className="text-gray-400">All in one tool</span>
              </li>
            </ul>
          </div>

          <div>
            <img
              src={Teaching}
              alt="Our mission"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
