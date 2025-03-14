import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={48} className="text-kanban-purple" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="bg-kanban-purple hover:bg-kanban-purple/90 transition-colors"
          size="lg"
          onClick={() => window.location.href = '/'}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
