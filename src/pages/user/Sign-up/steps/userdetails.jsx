import { useState } from 'react';
import api from '../../../../api/axios_api_call';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

export default function UserDetailStep({ NextToSignin, onBack }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '', // Optional
    username: '',
    role: '',
    password: '',
    email: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required.';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.length < 5) {
      newErrors.username = 'Username should be minimum 5 letters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        'Username can only contain lettters, numbers, and underscores.';
    }
    if (!formData.role) {
      newErrors.role = 'Role selection is required.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password =
        'Password must be at least 8 characters long. with upper, lower and number each atleast one';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one special character (!@#$%^&*).';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      });
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors)
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const email = localStorage.getItem('Temp_email');
      formData.email = email;

      const response = await api.post('auth-app/user-details/', formData);
      if (
        response.data['auth-status'] === 'success' &&
        response.status === 201
      ) {
        localStorage.removeItem('Temp_email');
        localStorage.removeItem('signup-step');
        toast.success('USER CREATED SUCCESSFULLY');
        setTimeout(() => {
          NextToSignin();
        }, 1000);
      } else if (
        response.data['auth-status'] === 'unauthorized' &&
        response.status === 401
      ) {
        toast.error(response.data['error']);
        localStorage.removeItem('Temp_email');
        localStorage.removeItem('signup-step');
      } else {
        toast.error(response.data['message']);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 max-w-lg mx-auto">
      <ToastContainer position="top-center" autoClose="1000" />
      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <label htmlFor="first_name" className="block text-sm font-medium ">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="mt-1 block w-full text-xs border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter your first name"
          />
          {/* {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name}</p>} */}
        </div>

        <div className="w-1/2">
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="mt-1 block w-full text-xs border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter your last name (optional)"
          />
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor="username" className="block text-sm font-medium ">
          Username<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="mt-1 block w-full text-xs border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          placeholder="username- minimum 5 letters"
        />
        {/* {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>} */}
      </div>

      <div className="mb-2 relative">
        <label htmlFor="password" className="block text-sm font-medium">
          Password <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block text-xs w-full border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-black"
            aria-label="Toggle password visibility"
          >
            <p>
              {showPassword ? (
                <Eye className="size-4" />
              ) : (
                <EyeClosed className="size-4" />
              )}
            </p>
          </button>
        </div>
        {/* {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>} */}
      </div>

      <div className="mb-2 relative">
        <label htmlFor="confirmPassword" className="block text-sm font-medium ">
          Confirm Password <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full text-xs border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 pr-10"
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
            aria-label="Toggle confirm password visibility"
          >
            <p>
              {showConfirmPassword ? (
                <Eye className="size-4" />
              ) : (
                <EyeClosed className="size-4" />
              )}
            </p>
          </button>
        </div>
        {/* {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>} */}
      </div>

      <div className="mb-4 flex">
        <label className="block text-sm mr-6 font-medium">
          Role
          <span className="text-red-600">*</span>
        </label>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="role"
              value="TUTOR"
              checked={formData.role === 'TUTOR'}
              onChange={handleInputChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-sm text-slate-300">Tutor</span>
          </label>
          {/* <input type="radio" name="radio-5" className="radio radio-success" defaultChecked />
            <input type="radio" name="radio-5" className="radio radio-success" /> */}
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="role"
              value="STUDENT"
              checked={formData.role === 'STUDENT'}
              onChange={handleInputChange}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-sm text-slate-300">Student</span>
          </label>
        </div>
        {/* {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>} */}
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full bg-emerald-400 text-white font-bold py-2 rounded hover:bg-emerald-700 transition duration-200 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Confirm Details'}
      </button>
    </div>
  );
}
