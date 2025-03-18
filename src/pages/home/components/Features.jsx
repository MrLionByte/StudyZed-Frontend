import {
  Video,
  ClipboardCheck,
  BarChart,
  MessageSquare,
  Calendar,
  BookOpen,
} from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
        Platform Features
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Everything you need to excel in your educational journey, whether you're
        a student or a tutor.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="feature-card glass p-6 rounded-xl">
          <Video className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Live Classes</h3>
          <p className="text-gray-400">
            Interactive virtual classrooms with real-time collaboration tools
          </p>
        </div>

        <div className="feature-card glass p-6 rounded-xl">
          <ClipboardCheck className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Assessments</h3>
          <p className="text-gray-400">
            Comprehensive testing and progress tracking system
          </p>
        </div>

        <div className="feature-card glass p-6 rounded-xl">
          <Calendar className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Schedule Management</h3>
          <p className="text-gray-400">
            Easy scheduling and calendar integration for classes
          </p>
        </div>

        <div className="feature-card glass p-6 rounded-xl">
          <BarChart className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-400">
            Detailed analytics and performance insights
          </p>
        </div>

        <div className="feature-card glass p-6 rounded-xl">
          <MessageSquare className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Instant Communication</h3>
          <p className="text-gray-400">
            Direct messaging and discussion forums
          </p>
        </div>

        <div className="feature-card glass p-6 rounded-xl">
          <BookOpen className="text-[#00FFB2] mb-4" size={32} />
          <h3 className="text-lg font-semibold mb-2">Resource Library</h3>
          <p className="text-gray-400">
            Access to study materials and resources
          </p>
        </div>
      </div>
    </section>
  );
}
