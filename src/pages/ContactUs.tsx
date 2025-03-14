import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('https://n8n.gupi.com.br/webhook-test/fa4fde42-c26e-4232-a992-092b68fbb835', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          user_id: user?.id,
          subject,
          message,
          datetime: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (data.response === 'success') {
        toast.success('Your message has been sent successfully');
        setSubject('');
        setMessage('');
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-white p-6">
        <div className="container mx-auto max-w-3xl">
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
              <CardTitle className="text-2xl">Contact Us</CardTitle>
              <CardDescription>Send us a message and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's your message about?"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please provide details..."
                    rows={6}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
