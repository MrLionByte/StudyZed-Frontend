import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate('/tutor/choose-session/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4 md:px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-green-500 text-white rounded-full p-3">
            <CancelledIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Payment Cancelled
          </h1>
          <div className="space-y-2 text-center">
            {/* <p className="text-gray-500 dark:text-gray-400">
              Order #12345 | $99.99 | Visa ending in 1234
            </p> */}
            <p className="text-gray-500 dark:text-gray-400">
              Payment has cancelled. You can continue with sessions and create
              session later.
            </p>
          </div>
          <a
            onClick={handleHomePage}
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

const CancelledIcon = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
};

export default PaymentCancelled;
