// types/scheduledEvent.types.ts
export interface ScheduledEvent {
    _id: string;
    status: string;
    scheduledTime: string;
    eventDetails: {
      startTime: string;
      endTime: string;
      summary: string;
      description: string;
      location: string;
      organizer: {
        name: string;
        email: string;
      };
      scheduledTime: string;
    };
    selectedUsers: {
      name: string;
      email: string;
      lastInvitedAt: string;
    }[];
  }
  