import { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  MessagesSquare,
  School,
  LineChart,
  Users,
  User,
  Bell,
  Wallet,
  LogOut,
  Camera,
  Edit2,
  Shield,
  Key,
  Mail,
  HelpCircle,
} from 'lucide-react';

function MyAccount() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <main className="flex-1 w-full h-full justify-center items-center p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          {/* Profile Sidebar */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-6 text-center">
              <div className="relative inline-block">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-teal-500"
                />
                <button className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full text-white hover:bg-teal-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">Sarah Johnson</h2>
              <p className="text-gray-600">Mathematics Tutor</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since Sept 2023
              </p>
            </div>

            <div className="border-t border-gray-200">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 p-4 text-left ${activeTab === 'profile' ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center space-x-3 p-4 text-left ${activeTab === 'security' ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
                >
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center space-x-3 p-4 text-left ${activeTab === 'notifications' ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center space-x-3 p-4 text-left ${activeTab === 'billing' ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
                >
                  <Wallet className="h-5 w-5 text-gray-600" />
                  <span>Billing & Payments</span>
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex items-center space-x-3 p-4 text-left ${activeTab === 'help' ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
                >
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span>Help & Support</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-2/3 p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h2>
                  <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-800">
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Full Name
                    </h3>
                    <p className="text-gray-800">Sarah Johnson</p>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Email Address
                    </h3>
                    <p className="text-gray-800">sarah.johnson@studyzed.com</p>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Phone Number
                    </h3>
                    <p className="text-gray-800">+1 (555) 123-4567</p>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Role
                    </h3>
                    <p className="text-gray-800">Mathematics Tutor</p>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Bio
                    </h3>
                    <p className="text-gray-800">
                      Mathematics educator with 8+ years of experience teaching
                      high school and college-level courses. Specialized in
                      calculus, algebra, and statistics with a passion for
                      making complex concepts accessible to all students.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                      Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        Calculus
                      </span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        Algebra
                      </span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        Statistics
                      </span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        Geometry
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Security Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Key className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                      </div>
                      <button className="text-teal-600 hover:text-teal-800">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-500">
                            Enabled via Email
                          </p>
                        </div>
                      </div>
                      <button className="text-teal-600 hover:text-teal-800">
                        Manage
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium">Login History</h3>
                          <p className="text-sm text-gray-500">
                            View your recent login activity
                          </p>
                        </div>
                      </div>
                      <button className="text-teal-600 hover:text-teal-800">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Notification Preferences
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">New messages</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">
                          Assignment updates
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">
                          Student progress reports
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">
                          Platform announcements
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">In-App Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">New messages</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">
                          Assignment deadlines
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700">
                          Student activity
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Billing & Payments
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Current Plan</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">
                          Professional Tutor
                        </p>
                        <p className="text-sm text-gray-500">$49.99/month</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Next billing date: June 15, 2025</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="text-teal-600 hover:text-teal-800">
                        Change Plan
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Payment Methods</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded">
                          <svg
                            className="h-6 w-6 text-blue-800"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 4H2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H2V6h20v12z" />
                            <path d="M12 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">
                            Expires 09/2026
                          </p>
                        </div>
                      </div>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        Default
                      </span>
                    </div>
                    <button className="text-teal-600 hover:text-teal-800 text-sm">
                      + Add Payment Method
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Billing History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invoice
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              May 15, 2025
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              $49.99
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-teal-600 hover:text-teal-800">
                              <a href="#">Download</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              Apr 15, 2025
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              $49.99
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-teal-600 hover:text-teal-800">
                              <a href="#">Download</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              Mar 15, 2025
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              $49.99
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-teal-600 hover:text-teal-800">
                              <a href="#">Download</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Help & Support
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                          <span>How do I schedule a tutoring session?</span>
                          <span className="transition group-open:rotate-180">
                            <svg
                              fill="none"
                              height="24"
                              shape-rendering="geometricPrecision"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                          To schedule a tutoring session, navigate to the "My
                          Class" section and click on "Schedule Session". Select
                          the date, time, and student(s) you want to tutor, then
                          click "Confirm".
                        </p>
                      </details>

                      <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                          <span>How are payments processed?</span>
                          <span className="transition group-open:rotate-180">
                            <svg
                              fill="none"
                              height="24"
                              shape-rendering="geometricPrecision"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                          Payments are processed automatically on the 15th of
                          each month. You can view your payment history and
                          update your payment method in the "Billing & Payments"
                          section.
                        </p>
                      </details>

                      <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                          <span>How do I create and assign assessments?</span>
                          <span className="transition group-open:rotate-180">
                            <svg
                              fill="none"
                              height="24"
                              shape-rendering="geometricPrecision"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                          Go to the "Assessment" section to create new
                          assessments. You can choose from various question
                          types and set due dates. Once created, you can assign
                          them to individual students or entire classes.
                        </p>
                      </details>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Contact Support</h3>
                    <p className="text-gray-600 mb-4">
                      Need additional help? Our support team is available 24/7
                      to assist you with any questions or issues.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <span>support@studyzed.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>1-800-STUDYZED (1-800-788-3993)</span>
                      </div>
                    </div>
                    <button className="mt-4 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 w-full">
                      Open Support Ticket
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-4">Resources</h3>
                    <div className="space-y-3">
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span>Tutor Handbook</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Video Tutorials</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Webinar Schedule</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyAccount;
