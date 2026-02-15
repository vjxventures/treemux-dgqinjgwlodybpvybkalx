'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Settings, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { UserProfile, Booking } from '@/lib/types';
import { formatDate } from '@/lib/scheduling';

export default function DashboardPage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${username}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load all bookings
    const bookings: Booking[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`bookings_${username}_`)) {
        const dateBookings = JSON.parse(localStorage.getItem(key) || '[]');
        bookings.push(...dateBookings);
      }
    }
    setAllBookings(bookings.sort((a, b) => b.date.localeCompare(a.date)));
  }, [username]);

  const copyBookingLink = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Unable to load dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = '/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">QuickCal</span>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = `/${username}`)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Booking Page
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile.name}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">{allBookings.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-indigo-600">
                  {profile.eventTypes.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Link</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={copyBookingLink}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Link */}
          <Card>
            <CardHeader>
              <CardTitle>Your Booking Page</CardTitle>
              <CardDescription>Share this link with anyone to let them book time with you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={copyBookingLink}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                {allBookings.length === 0
                  ? 'No bookings yet'
                  : `${allBookings.length} booking${allBookings.length !== 1 ? 's' : ''} total`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet. Share your link to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allBookings.map((booking) => {
                    const eventType = profile.eventTypes.find(
                      (e) => e.id === booking.eventTypeId
                    );
                    const bookingDate = new Date(booking.date);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1"
                          style={{ backgroundColor: eventType?.color || '#gray' }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{booking.attendeeName}</p>
                          <p className="text-sm text-gray-600">{booking.attendeeEmail}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(bookingDate)} at {booking.startTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            {eventType?.title || 'Meeting'} ({eventType?.duration} min)
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.status === 'confirmed' ? (
                            <span className="text-green-600 font-medium">Confirmed</span>
                          ) : (
                            <span className="text-red-600 font-medium">Cancelled</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Your Event Types</CardTitle>
              <CardDescription>The meeting types you offer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.eventTypes.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.duration} minutes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
