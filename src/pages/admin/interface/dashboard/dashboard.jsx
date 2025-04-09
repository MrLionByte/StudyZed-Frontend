import React, { useEffect, useState } from 'react';
import api, { API_BASE_URLS } from '../../../../api/axios_api_call';
import SessionData from './components/SessionData';
import AssessmentsData from './components/AssessmentData';
import TaskData from './components/TaskData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchFromBackend, setFetchFromBackend] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('session-admin/admin/dashboard/', {
        baseURL: API_BASE_URLS['Session_Service']
      });
      console.log("DASHBOARD", response);
      
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromBackend){
      fetchDashboardData();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Dashboard...</h2>
          <p>Please wait while we retrieve your data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={()=>setFetchFromBackend(true)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Learning Management Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <SessionData sessionData={dashboardData?.session_data} />
        </div>
        <div className="lg:col-span-2">
          <AssessmentsData assessmentData={dashboardData?.assessment_data} analyticsData={dashboardData?.analytics} />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
        <TaskData taskData={dashboardData?.task_data} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.session_data?.recent_sessions?.length === 0 ? (
                <p className="text-gray-500">No recent sessions found</p>
              ) : (
                <ul className="divide-y">
                  {dashboardData?.session_data?.recent_sessions?.map((session) => (
                    <li key={session.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{session.session_name}</p>
                          <p className="text-sm text-gray-500">Code: {session.session_code}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            {session.session_grade || 'No Grade'}
                          </span>
                          <p className="text-sm mt-1">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Top Performing Sessions</h3>
                  <ul className="space-y-2">
                    {dashboardData?.analytics?.top_sessions?.map((session, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{session.session_key__session_name}</span>
                        <span className="font-medium">
                          Avg Score: {session.avg_score.toFixed(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Assessment Duration</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-500">Average</p>
                      <p className="font-bold">
                        {Math.round(dashboardData?.analytics?.duration_stats?.avg_duration || 0)} min
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Min</p>
                      <p className="font-bold">
                        {dashboardData?.analytics?.duration_stats?.min_duration || 0} min
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max</p>
                      <p className="font-bold">
                        {dashboardData?.analytics?.duration_stats?.max_duration || 0} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}