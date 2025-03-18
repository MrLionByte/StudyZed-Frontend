import { ArrowRight } from 'lucide-react';

import LandingPageImage from '../../../assets/landingpageimage.png';
export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow">
            Learn,
            <br />
            Grow,
            <br />
            <span className="gradient-text">Succeed.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Learn from the best tutors, Teach with the best tools— StudyZed is
            here to support your journey.
          </p>
          <div className="flex space-x-4">
            <a
              href="#student-benefits"
              className="px-8 py-4 btn-primary rounded-lg flex items-center"
            >
              Start Learning <ArrowRight className="ml-2" size={20} />
            </a>
            <a
              href="#tutor-benefits"
              className="px-8 py-4 glass rounded-lg hover:bg-white/10 transition"
            >
              I'm a Tutor
            </a>
          </div>
        </div>

        <div className="md:w-1/2">
          <img
            src={LandingPageImage}
            alt="Students learning"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
