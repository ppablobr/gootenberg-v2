import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCardIcon } from 'lucide-react';

export const SubscriptionCard = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <Button 
          variant="outline" 
          className="w-full" 
          asChild
        >
          <Link to="/subscription">
            <CreditCardIcon className="mr-2" size={16} />
            Manage Subscription
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
