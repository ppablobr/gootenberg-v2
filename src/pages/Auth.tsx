import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(loginEmail, loginPassword);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      return alert('Passwords do not match');
    }
    try {
      await signUp(name, signupEmail, signupPassword);
      setConfirmEmail(signupEmail);
      setShowEmailConfirmDialog(true);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <Label htmlFor="signupEmail">Email</Label>
                <Input 
                  id="signupEmail" 
                  type="email" 
                  value={signupEmail} 
                  onChange={(e) => setSignupEmail(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="signupPassword">Password</Label>
                <Input 
                  id="signupPassword" 
                  type="password" 
                  value={signupPassword} 
                  onChange={(e) => setSignupPassword(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Create a password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="mt-1"
                  placeholder="Confirm your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster position="top-right" />

      {/* Email Confirmation Dialog */}
      <Dialog open={showEmailConfirmDialog} onOpenChange={setShowEmailConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email address</DialogTitle>
            <DialogDescription>
              We've sent a confirmation email to <strong>{confirmEmail}</strong>. 
              Please check your inbox and click on the confirmation link to complete your registration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setShowEmailConfirmDialog(false);
              setActiveTab('login');
            }}>
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
