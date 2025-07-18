import React, { Suspense, lazy } from 'react';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const Student = lazy(() => import('./components/Student'));
const Teacher = lazy(() => import('./components/Teacher'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const FAQ = lazy(() => import('./components/Faq'));
const CTA = lazy(() => import('./components/Cta'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-20"></div>
      <div className="relative">
        
        <Suspense
          fallback={<div className="justify-center content-center text-center mt-10">Loading...</div>}
        >
          <Navbar />
          <Hero />
          <Features />
          <Student />
          <Teacher />
          <About />
          <Contact />
          <FAQ />
          <CTA />
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
