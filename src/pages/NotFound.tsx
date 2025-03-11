
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-youtube-dark text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-youtube-red rounded-sm"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l-[30px] border-t-[15px] border-b-[15px] border-l-white border-t-transparent border-b-transparent"></div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Page not found</h1>
          <p className="text-xl text-youtube-gray mb-6">
            This page isn't available. Sorry about that. Try searching for something else.
          </p>
          <Button className="bg-youtube-red hover:bg-red-700 text-white">
            <Home className="mr-2 h-5 w-5" />
            <Link to="/">Go to Home Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
