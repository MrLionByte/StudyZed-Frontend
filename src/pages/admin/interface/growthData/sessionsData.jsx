import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function SessionData() {
  const [fetchFromBackend, setFetchFromBackend] = useState(true)

  const getSessionCountFromBackend = async ()=>{
    
  }

  useEffect(()=>{
    if (fetchFromBackend){

      setFetchFromBackend(false);
    }
  }, [])
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-1/2 h-1/3 text-center text-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">
            Total Number Of Sessions Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">26</p>
        </CardContent>
      </Card>
    </div>
  );
}
