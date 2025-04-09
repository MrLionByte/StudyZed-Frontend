import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';

export default function VideoMeetStats() {
  const [meetCount, setMeetCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchFromBackend, setFetchFromBackend] = useState(true)

  const fetchVideoStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('meet/admin/video-meet-stats/', {
        baseURL: API_BASE_URLS['Message_Service']
      });
      setMeetCount(response.data.total_meetings);
    } catch (err) {
      setError('Failed to fetch video meeting statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromBackend){
      fetchVideoStats();
      setFetchFromBackend(false)
    }
  }, [fetchFromBackend]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
  <div className="flex items-center justify-center mt-16">
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg mt-16">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Video Meetings</CardTitle>
        <CardDescription className="text-center">Total number of video sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center">{meetCount}</p>
      </CardContent>
    </Card>
  </div>

  );
}
