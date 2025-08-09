// context/ScheduledEventsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ScheduledEvent } from '../types/scheduledEvents.type';

interface ScheduledEventsContextType {
  scheduledEvents: ScheduledEvent[];
  setScheduledEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ScheduledEventsContext = createContext<ScheduledEventsContextType | undefined>(undefined);

export const ScheduledEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <ScheduledEventsContext.Provider value={{ scheduledEvents, setScheduledEvents, searchQuery, setSearchQuery }}>
      {children}
    </ScheduledEventsContext.Provider>
  );
};

export const useScheduledEvents = () => {
  const context = useContext(ScheduledEventsContext);
  if (!context) {
    throw new Error('useScheduledEvents must be used within a ScheduledEventsProvider');
  }
  return context;
};
