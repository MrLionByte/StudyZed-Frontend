import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CompanyRevenue() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-1/2 h-1/3 text-center text-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Company Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">$ 988</p>
        </CardContent>
      </Card>
    </div>
  );
}
