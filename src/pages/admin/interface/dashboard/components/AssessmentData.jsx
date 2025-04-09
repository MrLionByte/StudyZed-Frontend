import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SessionData({ sessionData }) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-6xl font-bold text-blue-600">
          {sessionData?.active_count || 0}
        </p>
        <p className="mt-4 text-gray-600">
          Total sessions currently active in the system
        </p>
      </CardContent>
    </Card>
  );
}