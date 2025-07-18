export default function FAQ() {
  return (
    <section id="faq" className="container mx-auto px-6 py-20 bg-black/20">
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Find answers to common questions about StudyZed's platform and services.
      </p>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">
            How do I get started as a student?
          </h3>
          <p className="text-gray-400">
            Simply sign up, complete your profile, and browse our tutor
            directory. You can book your first session with just a few clicks.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">
            What qualifications do tutors need?
          </h3>
          <p className="text-gray-400">
            Tutors must have relevant academic credentials or professional
            experience in their subject area, pass our verification process, and
            complete our platform training.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">
            How are payments handled?
          </h3>
          <p className="text-gray-400">
            We use secure payment processing. Students pay per session, and
            tutors receive payments directly to their accounts after each
            completed session.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">
            What if I need to cancel a session?
          </h3>
          <p className="text-gray-400">
            Sessions can be cancelled or rescheduled up to 24 hours before the
            scheduled time without any penalty.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">
            Is there a mobile app available?
          </h3>
          <p className="text-gray-400">
            No, StudyZed is available as web version for now, but we will defiantly make it available for ios and android soon.
          </p>
        </div>
      </div>
    </section>
  );
}
