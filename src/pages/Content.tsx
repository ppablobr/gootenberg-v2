import React from 'react';
import Navbar from '@/components/Navbar';

const Content: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Content Repository</h1>
          <p className="text-gray-600">
            Your created content from the News Board will appear here.
          </p>
          <p className="text-gray-500 mt-4">
            This page is currently under development.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Content;
