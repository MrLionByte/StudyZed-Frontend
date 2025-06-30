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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Banknote } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { TutorEndPoints } from '../../../../api/endpoints/userEndPoints';
import { getSavedAuthData } from '../../../../utils/Localstorage';
import api, {
  API_BASE_URLS as api_dictionary,
} from '../../../../api/axios_api_call';

export default function CardWithForm({ cancelModal, accountNumber }) {
  const [amount, setAmount] = useState(50);
  const [description, setDescription] = useState('');

  const handleCancelButton = () => {
    cancelModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_data = getSavedAuthData();

      const transactionData = {
        account_number: accountNumber,
        note: description,
        user_code: user_data.user_code,
        amount: amount,
        url: `${window.location.origin}${window.location.pathname}`,
      };

      const url = api_dictionary.Payment_Service;

      const response = await api.post(
        TutorEndPoints.AddToWallet,
        transactionData,
        {
          baseURL: url,
        },
      );

      if (response.data?.checkout_url) {
        sessionStorage.setItem('stripeStatus', 'pending');
        window.location.href = response.data.checkout_url;
      }
      if (response.data.status === 400) {
        toast.warning('Failed to complete transaction');
      }
    } catch(error) {
      console.error('Error creating payment session:', error);
      toast.error('There was an error initiating payment.');
    }
  };

  const handleBuySession = () => {};

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add to Wallet</CardTitle>
            <div className="relative group">
              <Banknote className="hover:text-blue-500" />
            </div>
          </div>
          <CardDescription>
            Add money to wallet for easy to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={TutorEndPoints.CreateSessionPayment}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 justify-center items-center w-full">
                <div className="text-center">
                  <Label htmlFor="amount">Amount : </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="100"
                    max="10000"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50.00 Max: 10,000"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Add a note (Optional):</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="writing..."
                  className="p-2 border rounded-md"
                  rows="4"
                />
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
          <Button onClick={handleSubmit} className="bg-slate-600 hover:bg-green-600">
            ADD MONEY
          </Button>
        </CardFooter>
        <ToastContainer />
      </Card>
    </>
  );
}
