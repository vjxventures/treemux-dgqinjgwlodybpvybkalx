export interface EventType {
  id: string;
  title: string;
  duration: number; // in minutes
  description?: string;
  color: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;
}

export interface WeeklyAvailability {
  [key: string]: TimeSlot[]; // day: 'monday', 'tuesday', etc.
}

export interface UserProfile {
  username: string;
  name: string;
  email?: string;
  timezone: string;
  eventTypes: EventType[];
  availability: WeeklyAvailability;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  attendeeName: string;
  attendeeEmail: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string;
  notes?: string;
  status: 'confirmed' | 'cancelled';
}
