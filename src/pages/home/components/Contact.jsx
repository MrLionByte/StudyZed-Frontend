import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { API_BASE_URLS } from '../../../api/axios_api_call';

export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = API_BASE_URLS['Message_Service'];
    try {
      const response = await fetch(url+"messages-to-admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <section id="contact" className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
        Get in Touch
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Have questions? We're here to help. Reach out to our team for support or
        inquiries.
      </p>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-start">
            <Mail className="text-[#00FFB2] mr-4" size={24} />
            <div>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-gray-400">support@studyzed.com</p>
            </div>
          </div>

          {/* <div className="flex items-start">
                <Phone className="text-[#00FFB2] mr-4" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div> */}

          <div className="flex items-start">
            <MapPin className="text-[#00FFB2] mr-4" size={24} />
            <div>
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-gray-400">
                Kinfra Techno Industrial Park
                <br />
                Kerala, Calicut 673634
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your name'
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-800 focus:border-[#00FFB2] focus:outline-none focus:ring-1 focus:ring-[#00FFB2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email to reach out'
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-800 focus:border-[#00FFB2] focus:outline-none focus:ring-1 focus:ring-[#00FFB2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder='Enter your phone number with country code'
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-800 focus:border-[#00FFB2] focus:outline-none focus:ring-1 focus:ring-[#00FFB2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder='Enter the message to deliver'
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-800 focus:border-[#00FFB2] focus:outline-none focus:ring-1 focus:ring-[#00FFB2] h-32"></textarea>
          </div>

          <button 
            type="submit"
            className="w-full px-8 py-4 btn-primary rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
