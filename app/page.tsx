// app/page.tsx
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchAndFilter from '@/app/components/SearchAndFilter';
import HackathonList from '@/app/components/HackathonList';
import HackathonCalendar from '@/app/components/HackathonCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/app/components/mode-toggle';

const queryClient = new QueryClient();

export default function Home() {
  const [filters, setFilters] = useState({ platform: 'all', mode: 'all', search: '' });

  const handleFilterChange = (platform: string, mode: string, search: string) => {
    setFilters({ platform, mode, search });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Hackathon Hub</h1>
          <ModeToggle />
        </div>
        
        <SearchAndFilter onFilterChange={handleFilterChange} />
        <Tabs defaultValue="list" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <HackathonList platform={filters.platform} mode={filters.mode} search={filters.search} />
          </TabsContent>
          <TabsContent value="calendar">
            <HackathonCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}