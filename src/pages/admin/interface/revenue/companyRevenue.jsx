import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';

export default function CompanyRevenue() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        setLoading(true);
        const response = await api.get('payment-admin/total-revenue/', {
          baseURL: API_BASE_URLS['Payment_Service']
        });
        
        setTotalRevenue(response.data.total_revenue);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching total revenue:', err);
        setError('Failed to load revenue data');
        setLoading(false);
      }
    };

    fetchTotalRevenue();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-1/2 h-1/3 text-center text-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Company Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-lg">Loading revenue data...</p>
          ) : error ? (
            <p className="text-lg text-red-500">{error}</p>
          ) : (
            <p className="text-4xl font-bold">$ {totalRevenue}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
