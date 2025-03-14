import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const Subscription: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate('/account')}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Account
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subscription Management</CardTitle>
            <CardDescription>Manage your subscription plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Subscription management features are currently in development. 
                Soon you'll be able to upgrade your plan, manage billing, and access premium features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
