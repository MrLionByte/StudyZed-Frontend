import {
  CheckCircle,
  Brain,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
} from 'lucide-react';

export default function Student() {
  return (
    <section
      id="student-benefits"
      className="container mx-auto px-6 py-20 bg-black/20"
    >
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
        Why Learn with StudyZed?
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Experience personalized learning that adapts to your needs and helps you
        achieve your academic goals.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass p-6 rounded-xl">
          <Brain className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
          <p className="text-gray-400">
            Custom-tailored study plans that adapt to your learning style and
            pace
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <CheckCircle className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Expert Tutors</h3>
          <p className="text-gray-400">
            Learn from verified experts in your subject area
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <TrendingUp className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-400">
            Monitor your improvement with detailed performance analytics
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Clock className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
          <p className="text-gray-400">
            Book sessions at times that work best for you
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Shield className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">
            Safe Learning Environment
          </h3>
          <p className="text-gray-400">
            Secure platform with verified tutors and monitored sessions
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <DollarSign className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Affordable Pricing</h3>
          <p className="text-gray-400">
            Competitive rates with flexible payment options
          </p>
        </div>
      </div>
    </section>
  );
}
