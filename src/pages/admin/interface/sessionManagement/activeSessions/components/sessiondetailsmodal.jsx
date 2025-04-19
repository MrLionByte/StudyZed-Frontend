import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { adminEndPoints } from './../../../../../../api/endpoints/adminEndPoint';

export default function SessionPaymentDetails({
  SessionData,
  cancelModal,
  handleSessionBlock,
}) {
  return (
    <>
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Session Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Is Active:</strong> {SessionData.is_active ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Session Code:</strong> {SessionData.session_code}
            </div>
            <div>
              <strong>Tutor Code:</strong> {SessionData.tutor_code}
            </div>
            <div>
              <strong>Subscription Type:</strong>{' '}
              {SessionData.subscription_type} month
            </div>
            <div>
              <strong>Created At:</strong> {SessionData.created_at}
            </div>
            <div>
              <strong>Expiry Time:</strong> {SessionData.expiry_time}
            </div>
            <div>
              <strong>Payment Details:</strong>
              <ul className="list-disc pl-5">
                {SessionData.payment_set.map((payment, index) => (
                  <li key={index}>
                    <div className="text-green-500">
                      <strong>Amount:</strong> {payment.amount}
                    </div>
                    <div>
                      <strong>Payment Date:</strong> {payment.payment_date}
                    </div>
                    <div className="text-green-500">
                      <strong>Status:</strong> {payment.status}
                    </div>
                    <div>
                      <strong>Transaction ID:</strong> {payment.transaction_id}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <div className="flex justify-between p-4">
          {/* <Button
            onClick={(e) => handleSessionBlock(e)}
            className="hover:bg-red-600"
            variant="outline"
          >
            Block Session
          </Button> */}

          <Button
            onClick={cancelModal}
            className="hover:bg-red-600"
            variant="outline"
          >
            Close
          </Button>
        </div>
      </Card>
    </>
  );
}
