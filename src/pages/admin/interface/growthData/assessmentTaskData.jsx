import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';


export default function AssessmentTaskStats() {
  const [stats, setStats] = useState({
    assessments: 0,
    tasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchFromBackend, setFetchFromBackend] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('session-admin/admin/assessment-task-stats/', {
        baseURL: API_BASE_URLS['Session_Service']
      });
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch assessment and task statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(fetchFromBackend){
      fetchStats();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='px-10'>
    <div className="flex space-x-4 items-center justify-center mt-16">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Assessments & Tasks</CardTitle>
          <CardDescription>Total count of all assignments and Tasks created so far</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around">
          <div className="text-center">
            <p className="text-lg font-medium">Assessments</p>
            <p className="text-4xl font-bold">{stats.assessments}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Tasks</p>
            <p className="text-4xl font-bold">{stats.tasks}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}