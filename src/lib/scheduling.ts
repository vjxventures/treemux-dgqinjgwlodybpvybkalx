import { WeeklyAvailability, TimeSlot } from './types';

export const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  monday: [{ start: '09:00', end: '17:00' }],
  tuesday: [{ start: '09:00', end: '17:00' }],
  wednesday: [{ start: '09:00', end: '17:00' }],
  thursday: [{ start: '09:00', end: '17:00' }],
  friday: [{ start: '09:00', end: '17:00' }],
  saturday: [],
  sunday: [],
};

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function generateTimeSlots(
  date: Date,
  availability: TimeSlot[],
  duration: number,
  bookedSlots: { startTime: string; endTime: string }[] = []
): string[] {
  const slots: string[] = [];

  for (const timeRange of availability) {
    let currentMinutes = timeToMinutes(timeRange.start);
    const endMinutes = timeToMinutes(timeRange.end);

    while (currentMinutes + duration <= endMinutes) {
      const slotStart = minutesToTime(currentMinutes);
      const slotEnd = minutesToTime(currentMinutes + duration);

      // Check if slot conflicts with any booked slots
      const isBooked = bookedSlots.some((booked) => {
        const bookedStart = timeToMinutes(booked.startTime);
        const bookedEnd = timeToMinutes(booked.endTime);
        const currentEnd = currentMinutes + duration;

        return (
          (currentMinutes >= bookedStart && currentMinutes < bookedEnd) ||
          (currentEnd > bookedStart && currentEnd <= bookedEnd) ||
          (currentMinutes <= bookedStart && currentEnd >= bookedEnd)
        );
      });

      if (!isBooked) {
        slots.push(slotStart);
      }

      currentMinutes += 15; // 15-minute intervals
    }
  }

  return slots;
}

export function getDayName(date: Date): string {
  return DAYS_OF_WEEK[date.getDay()];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getNextNDays(n: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < n; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  return days;
}
