import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Newspaper, User, Menu, X, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-black">Gootenberg</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to="/">
                    <Newspaper className="mr-1" size={16} />
                    News board
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to="/content">
                    <FileText className="mr-1" size={16} />
                    Content
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                >
                  <Link to="/account">
                    <User size={20} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-2 space-y-2 pb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="w-full justify-start"
            >
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Newspaper className="mr-2" size={16} />
                News board
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="w-full justify-start"
            >
              <Link to="/content" onClick={() => setMobileMenuOpen(false)}>
                <FileText className="mr-2" size={16} />
                Content
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="w-full justify-start"
            >
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                <User className="mr-2" size={16} />
                Account
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
