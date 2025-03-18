import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-6">
            <GraduationCap className="text-[#00FFB2] w-6 h-6" />
            <span className="text-xl font-bold ml-2 gradient-text">
              StudyZed
            </span>
          </div>
          <p className="text-gray-400">
            Personalizing education through technology and human connection.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                How it Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00FFB2]">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>© 2025 StudyZed. All rights reserved.</p>
      </div>
    </footer>
  );
}
