import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {ShoppingCart, ShoppingCartIcon, WalletIcon, DollarSignIcon, 
    IndianRupee, LightbulbIcon, PhoneIcon, Landmark, CirclePlus,
    Minus, Plus} from 'lucide-react'

import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import api, { api_dictatory as api_dictatory } from "../../../api/axios_api_call";
import { TutorEndPoints } from "../../../api/endpoints/userEndPoints";
import AddMoneyModal from "./components/addMoney";
import { toast, ToastContainer } from "react-toastify";
import Navbar from '../SessionChoice/components/navbar.jsx';
import { getSavedAuthData } from "../../../utils/Localstorage.js";

const Wallet = () => {
    const [balance, setBalance] = useState("0.00");
    const [symbol, setSymbol] = useState(<IndianRupee />)
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [currencyMode, setCurrencyMode] = useState('INR');
    const [autoCredit, setAutoCredit] = useState(false);
    const [autoDebit, setAutoDebit] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [isAddMoney, setIsAddMoney] = useState(false);
    const [accountNumber, setAccountNumber] = useState("000");
    const [status, setStatus] = useState(null);


    const getDataFromBackend = async () => {
        try{
            const url = api_dictatory.Payment_Service
            const user = getSavedAuthData()
            
            const response = await api.get(TutorEndPoints.GetWalletDetails, {
                baseURL: url
            })
            console.log(response.data);
            setBalance(response.data.results.balance)
            setCurrencyMode(response.data.results.currency_mode)
            setTransactions(response.data.results.transactions)
            setAccountNumber(response.data.results.account_number)
            
        } catch {
            console.log("Wallet Error",error);
            
        }
    }

    const handleAddMoney = ()=> {
        setIsAddMoney(true)
    }

    const closeModal = () => {
        setIsAddMoney(false)
    }

    useEffect (()=> {
        if (fetchFromBackend) {
            getDataFromBackend()
            setFetchFromBackend(false)
        }

        
    }, [fetchFromBackend]);
    console.log("TRA :", transactions);
    
    useEffect(() => {
      const fetchPaymentStatus = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get("transaction_id");
        const paymentStatus = urlParams.get("status");
  
        if (paymentStatus === "success") {
          setStatus("success");
          
          urlParams.delete("transaction_id");
          urlParams.delete("status");
          window.history.replaceState({}, document.title, window.location.pathname);
        
          setTimeout(() => {
            setStatus(null);
          }, 1500);

        } else if (paymentStatus === "cancel") {
          setStatus("cancel");
          
          urlParams.delete("transaction_id");
          urlParams.delete("status");
          window.history.replaceState({}, document.title, window.location.pathname);
        
          setTimeout(() => {
            setStatus(null);
          }, 1500);
        }
      };
  
      fetchPaymentStatus();
    }, []);

    return(
      <div className="max-h-fit">
         <Navbar />
      <div className="flex justify-center items-center mt-5">
       
             
      {status === "success" ? (
        <div className="animate-bounce">
          <CircleCheckIcon className="mx-auto h-20 w-20 text-green-500" />
          <h2 className="bg-slate-500 text-green-300 font-bold rounded-full p-4">
            Payment Successful
          </h2>
        </div>
      ) : status === "cancel" ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-bounce">
            <CircleCrossIcon className="mx-auto h-20 w-20 text-red-500" />
            <h2 className="text-red-300 font-bold bg-slate-500 rounded-full p-4">Payment Cancelled</h2>
          </div>
        </div>
      ) : (
        <div></div>
      )}
            
            {isAddMoney &&
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <AddMoneyModal cancelModal={closeModal} accountNumber={accountNumber} />
            </div>
            }
           <div className="flex flex-col sm:flex-col lg:flex-row lg:space-x-4 lg:justify-between sm:space-y-4 lg:space-y-0">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                    <CardTitle>Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <div className="text-4xl font-bold flex justify-center items-center">
                        {symbol}
                        {balance}
                    </div>
                    <div className="flex justify-between mt-3">
                    <div className="relative group">
                    <Button data-tooltip-target="tooltip-default" 
                        onClick={handleAddMoney}
                        variant="outline"  size="sm">
                    {/* Withdraw */}
                    <CirclePlus />
                        
                    </Button>
    
                    <div
                        className="absolute top-full left-1/2 transform
                                -translate-x-1/2 mt-2 w-max px-2 py-1 
                                text-sm text-white bg-gray-700 rounded
                                shadow-lg opacity-0 group-hover:opacity-100">
                            Add Money
                        </div>
                    </div>
                    <div className="relative group">
                    <Button data-tooltip-target="tooltip-default" variant="outline"  size="sm">
                    {/* Withdraw */}
                    <Landmark />
                        
                    </Button>
    
                    <div
                        className="absolute top-full left-1/2 transform
                                -translate-x-1/2 mt-2 w-max px-2 py-1 
                                text-sm text-white bg-gray-700 rounded
                                shadow-lg opacity-0 group-hover:opacity-100">
                            Withdraw Money
                        </div>
                    </div>
                    </div>
                </CardContent>
              </Card>

              <Card className="gap-y-24">
                <CardHeader>
                  <CardTitle>Upcoming Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <LightbulbIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium">Electricity Bill</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Due May 25, 2023</div>
                        </div>
                      </div>
                      <div className="text-gray-900 dark:text-gray-50">-$125.00</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <PhoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium">Phone Bill</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Due June 1, 2023</div>
                        </div>
                      </div>
                      <div className="text-gray-900 dark:text-gray-50">-$75.00</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:underline" prefetch={false}>
                    View all bills
                  </Link>
                </CardFooter>
              </Card>

            </div>
          
            <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                {transactions && transactions.slice(0, 5).map((transaction) => {
                    return (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                      {transaction.transaction_type === "CREDIT"? 
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                          <Plus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        </div>
                        :
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                            <Minus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      }
                        <div>
                          <div className="font-medium">{transaction.transaction_type}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.transaction_date}</div>
                        </div>
                      </div>
                      <div className="text-gray-900 dark:text-gray-50">
                        <p className="text-black">{currencyMode} </p>
                        {transaction.transaction_type === "CREDIT"? 
                        <p className="text-green-500">{transaction.amount} </p>
                        : 
                        <p className="text-red-500">{transaction.amount} </p>
                        }
                    </div>
                    </div>
                    )
                    })}

                    
                  </div>
                  
                </CardContent>
                <CardFooter>
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:underline" prefetch={false}>
                    View all transactions
                  </Link>
                </CardFooter>
              </Card>

              

            </div>
            <ToastContainer />
        </div>
        </div>
    );
};

export default Wallet;


function CircleCheckIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CircleCrossIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red" // Set the stroke color to red
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}
