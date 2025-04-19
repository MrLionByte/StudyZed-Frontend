import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { Info, Wallet, X } from 'lucide-react';

import {
  userCommonEndPoints,
  TutorEndPoints,
} from '../../../../../../api/endpoints/userEndPoints';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import api, { API_BASE_URLS } from '../../../../../../api/axios_api_call';
import { getSessionData } from '../../../components/currentSession';

export default function CardWithForm({ cancelModal }) {
  const [sessionName, setSessionName] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState(0);
  const [grade, setGrade] = useState('A');
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [walletBalance, setWalletBalance] = useState(0);
  const [errorFound, setErrorFound] = useState('');
  const [isAmount, setIsAmount] = useState(false);
  const [prices, setPrices] = useState([]);

  const handleDurationChange = (e) => {
    const selectedDuration = Number(e.target.value);
    setDuration(selectedDuration);
    const selectedPrice = prices.find(
      (item) => item.duration === selectedDuration,
    );
    
    setAmount(selectedPrice.amount);
    if (selectedPrice) {
      setAmount(Number(selectedPrice.amount));
    } else {
      setAmount('0.00');
    }
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= 2) {
      setGrade(value);
    }
  };

  const getWalletDataFromBackend = async () => {
    try {
      const url = API_BASE_URLS.Payment_Service;
      const response = await api.get(TutorEndPoints.GetWalletDetails, {
        baseURL: url,
      });
      setWalletBalance(response.data.results.balance);
    } catch (error) {
      // toast.error("Wallet error, try again later")
    }
  };

  const handleCancelButton = () => {
    cancelModal();
  };

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  const handleSessionName = (e) => {
    setSessionName(e);
    setErrorFound('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionName.trim() === '' || amount === 0) {
      setErrorFound('Enter session name and Choose duration');
      return;
    }
    try {
      const sessionData = getSessionData();
      const url = API_BASE_URLS['Session_Service'];

      const response = await api.post(
        TutorEndPoints.CreateNewSession,
        {session_code: sessionData?.sessions?.session_code},
        {
          baseURL: url,
        },
      );

      if (response.data.status === 201) {
        const paymentData = {
          session_code: response.data.data.session_code,
          tutor_code: response.data.data.tutor_code,
          session_name: sessionName,
          amount: amount,
        };

        const url = API_BASE_URLS['Payment_Service'];

        if (selectedPayment === 'wallet') {
          const delay = (ms) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          await delay(2000);
          console.log('WHAT ', selectedPayment);

          const payment_response = await api.post(
            TutorEndPoints.CreateSessionUsingWallet,
            paymentData,
            {
              baseURL: url,
            },
          );
          console.log('WALLET :', payment_response);
        } else {
          const payment_response = await api.post(
            TutorEndPoints.CreateSessionPayment,
            paymentData,
            {
              baseURL: url,
            },
          );
          if (payment_response.data?.checkout_url) {
            window.location.href = payment_response.data.checkout_url;
          }
        }

        if (response.data.status === 400) {
          toast.warning('Session with same name already exist for you');
        }
      } else if (
        response.data.status === 400 &&
        response.data.message === 'Validation failed'
      ) {
        setErrorFound('Session name is already exist');
      }
    } catch (error) {
      alert('There was an error initiating payment.');
    }
  };

  const handleBuySession = () => {};

  const handleSeeAmounts = () => {
    fetchPaymentDetails();
    setIsAmount(!isAmount);
  };

  const fetchPaymentDetails = async () => {
    try {
      const url = API_BASE_URLS['Payment_Service'];
      const response = await api.get(userCommonEndPoints.AllPaymentData, {
        baseURL: url,
      });
      console.log(response.data);
      setPrices(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!walletBalance) {
      getWalletDataFromBackend();
      fetchPaymentDetails();
    }
  }, []);

  return (
    <div className='flex flex-col justify-center items-center'>
      {isAmount && (
        <div className="z-50 flex">
          <Carousel className="w-40 md:w-full max-w-sm">
            <div className="flex justify-center">
              <X onClick={() => setIsAmount(false)}
                className="text-center cursor-pointer text-red-500 hover:size-7
          hover:text-red-300"
              />
            </div>
            <CarouselContent className="-ml-1">
              {prices.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <div className="text-center">
                          <span className="text-2xl font-semibold">
                            ₹{item.amount}
                          </span>
                          <p className="text-sm">
                            Duration:
                            <br /> {item.duration} months
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Renew Subscription</CardTitle>
            <div className="relative group">
              <Info
                onClick={handleSeeAmounts}
                className="cursor-pointer hover:text-blue-500"
              />
              <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 z-50 transition-opacity duration-300">
                Payment Details
              </div>
            </div>
          </div>
          <CardDescription>extend session duration.</CardDescription>
        </CardHeader>
        <p className="text-red-500 text-center p-1 font-medium">{errorFound}</p>
        <CardContent>
          <form action={TutorEndPoints.CreateSessionPayment}>
            <div className="grid w-full items-center gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col space-y-1.5 w-3/4">
                  <Label htmlFor="duration">Duration:</Label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={handleDurationChange}
                    className="p-2 border rounded-sm"
                  >
                    <option value="" disabled>
                      Choose a session
                    </option>
                    {prices.map((item) => (
                      <option key={item.id} value={item.duration}>
                        {item.duration} Month{item.duration > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5 w-1/4 text-center">
                  <Label htmlFor="amount">Amount:</Label>
                  {amount === 0 ? (
                    <p
                      id="amount"
                      className="p-1 border bg-slate-800 rounded-sm"
                    >
                      Choose
                    </p>
                  ) : (
                    <p
                      id="amount"
                      className="p-1 border bg-slate-800 rounded-sm"
                    >
                      {amount}
                    </p>
                  )}
                </div>
              </div>
             
              <div className="">
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(value) => setSelectedPayment(value)}
                  className="flex justify-between"
                >
                  <div className="flex items-center w-1/2 space-x-2">
                    <RadioGroupItem
                      value="stripe"
                      id="r1"
                      className={`relative w-6 h-6 rounded-full border border-gray-400 ${
                        selectedPayment === 'stripe'
                          ? 'bg-blue-700'
                          : 'bg-white'
                      }`}
                    >
                      <div
                        className={`absolute inset-1/2 w-3 h-3 rounded-full transition-transform ${
                          selectedPayment === 'stripe'
                            ? 'bg-white scale-100'
                            : 'bg-transparent scale-0'
                        }`}
                      />
                    </RadioGroupItem>
                    <Label
                      htmlFor="r1"
                      className="flex items-center font-bold gap-2 text-blue-700"
                    >
                      STRIPE
                    </Label>
                  </div>

                  {/* <div className="flex items-center w-1/2 space-x-2">
              {walletBalance < amount ? <div>Wallet Unavailable</div> :
              <>
                <RadioGroupItem
                  value="wallet"
                  id="r2"
                  className={`relative w-6 h-6 rounded-full border border-gray-400 ${
                    selectedPayment === "wallet" ? "bg-blue-700" : "bg-white"
                  }`}
                >
                  <div
                    className={`absolute inset-1/2 w-3 h-3 rounded-full transition-transform ${
                      selectedPayment === "wallet" ? "bg-white scale-100" : "bg-transparent scale-0"
                    }`}
                  />
                </RadioGroupItem>
                <Label htmlFor="r2" className="flex items-center gap-2">
                  <Wallet /> WALLET
                </Label>
                </>
                }
              </div> */}
                </RadioGroup>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleCancelButton}
            className="hover:bg-red-600"
            variant="outline"
          >
            Cancel
          </Button>
          {/* <Button>Add to Cart</Button> */}
          <Button onClick={handleSubmit} className="border text-black hover:bg-green-600">
            Buy Session
          </Button>
        </CardFooter>
        <ToastContainer />
      </Card>
    </div>
  );
}
