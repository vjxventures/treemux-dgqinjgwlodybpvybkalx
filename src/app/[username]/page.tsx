'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Mail, CheckCircle2 } from 'lucide-react';
import { UserProfile, EventType, Booking } from '@/lib/types';
import { generateTimeSlots, getDayName, formatDate, getNextNDays } from '@/lib/scheduling';

export default function BookingPage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${username}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [username]);

  useEffect(() => {
    if (selectedDate && selectedEvent && profile) {
      const dayName = getDayName(selectedDate);
      const availability = profile.availability[dayName] || [];

      // Get existing bookings for this date
      const dateKey = selectedDate.toISOString().split('T')[0];
      const existingBookings = JSON.parse(
        localStorage.getItem(`bookings_${username}_${dateKey}`) || '[]'
      );

      const slots = generateTimeSlots(
        selectedDate,
        availability,
        selectedEvent.duration,
        existingBookings.map((b: Booking) => ({
          startTime: b.startTime,
          endTime: b.endTime,
        }))
      );
      setAvailableSlots(slots);
    }
  }, [selectedDate, selectedEvent, profile, username]);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedEvent) return;

    const dateKey = selectedDate.toISOString().split('T')[0];
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + selectedEvent.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    const booking: Booking = {
      id: Date.now().toString(),
      eventTypeId: selectedEvent.id,
      attendeeName,
      attendeeEmail,
      date: dateKey,
      startTime: selectedTime,
      endTime,
      status: 'confirmed',
    };

    // Save booking
    const existingBookings = JSON.parse(
      localStorage.getItem(`bookings_${username}_${dateKey}`) || '[]'
    );
    existingBookings.push(booking);
    localStorage.setItem(`bookings_${username}_${dateKey}`, JSON.stringify(existingBookings));

    setBookingConfirmed(true);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              This booking page doesn't exist yet. Want to create your own?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = '/')}>
              Create Your Booking Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription>
              Your meeting with {profile.name} has been scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg text-left space-y-2">
              <p className="text-sm">
                <strong>{selectedEvent?.title}</strong>
              </p>
              <p className="text-sm text-gray-600">
                {selectedDate && formatDate(selectedDate)}
              </p>
              <p className="text-sm text-gray-600">{selectedTime}</p>
              <p className="text-sm text-gray-600">{attendeeEmail}</p>
            </div>
            <p className="text-sm text-gray-500">
              A confirmation email would be sent to {attendeeEmail}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = '/')}
            >
              Create Your Own Booking Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">QuickCal</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: User Info & Event Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription>{profile.timezone}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Event Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.eventTypes.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEvent?.id === event.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.duration} min
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Date & Time Selection */}
          <div className="space-y-6">
            {selectedEvent && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {getNextNDays(14).map((date) => {
                        const dayName = getDayName(date);
                        const hasAvailability =
                          profile.availability[dayName]?.length > 0;
                        return (
                          <button
                            key={date.toISOString()}
                            disabled={!hasAvailability}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-lg border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              selectedDate?.toISOString() === date.toISOString()
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="text-xs text-gray-500 capitalize">
                              {dayName.slice(0, 3)}
                            </p>
                            <p className="font-medium">
                              {date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Time</CardTitle>
                      <CardDescription>
                        {formatDate(selectedDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {availableSlots.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No available slots for this date
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 rounded border-2 text-sm transition-all ${
                                selectedTime === time
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {selectedTime && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <Input
                          value={attendeeName}
                          onChange={(e) => setAttendeeName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={attendeeEmail}
                          onChange={(e) => setAttendeeEmail(e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleBooking}
                        disabled={!attendeeName || !attendeeEmail}
                      >
                        Confirm Booking
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
