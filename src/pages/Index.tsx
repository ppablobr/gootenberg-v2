import React from 'react';
import Navbar from '@/components/Navbar';
import KanbanBoard from '@/components/KanbanBoard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
