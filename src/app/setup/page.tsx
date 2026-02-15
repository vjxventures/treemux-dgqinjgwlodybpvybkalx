'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Save } from 'lucide-react';
import { UserProfile, EventType, WeeklyAvailability, TimeSlot } from '@/lib/types';
import { DEFAULT_AVAILABILITY, DAYS_OF_WEEK } from '@/lib/scheduling';

function SetupContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    username: searchParams.get('username') || '',
    name: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    availability: DEFAULT_AVAILABILITY,
    eventTypes: [
      {
        id: '1',
        title: '15 Minute Meeting',
        duration: 15,
        color: '#3B82F6',
      },
      {
        id: '2',
        title: '30 Minute Meeting',
        duration: 30,
        color: '#8B5CF6',
      },
      {
        id: '3',
        title: '1 Hour Meeting',
        duration: 60,
        color: '#10B981',
      },
    ],
  });

  const handleSave = () => {
    // Save to localStorage for demo purposes
    localStorage.setItem(`profile_${profile.username}`, JSON.stringify(profile));
    window.location.href = `/${profile.username}`;
  };

  const toggleDayAvailability = (day: string) => {
    setProfile((prev) => {
      const availability = { ...prev.availability };
      if (availability[day] && availability[day].length > 0) {
        availability[day] = [];
      } else {
        availability[day] = [{ start: '09:00', end: '17:00' }];
      }
      return { ...prev, availability };
    });
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setProfile((prev) => {
      const availability = { ...prev.availability };
      if (availability[day]) {
        availability[day][index] = { ...availability[day][index], [field]: value };
      }
      return { ...prev, availability };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">QuickCal</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          {/* Progress */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-20 rounded-full ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s/g, '-') })
                    }
                    placeholder="john-doe"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your booking page: quickcal.app/{profile.username || 'username'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email (optional)</label>
                  <Input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <Input value={profile.timezone} disabled />
                </div>
                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!profile.username || !profile.name}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Availability */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>When are you available for meetings?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const isAvailable =
                    profile.availability && profile.availability[day]?.length > 0;
                  return (
                    <div key={day} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                      <div className="flex items-center gap-2 w-32">
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          onChange={() => toggleDayAvailability(day)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                      {isAvailable && (
                        <div className="flex-1 space-y-2">
                          {profile.availability![day].map((slot: TimeSlot, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) =>
                                  updateTimeSlot(day, idx, 'start', e.target.value)
                                }
                                className="w-32"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) =>
                                  updateTimeSlot(day, idx, 'end', e.target.value)
                                }
                                className="w-32"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Event Types */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Event Types</CardTitle>
                <CardDescription>These are the meeting types you'll offer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.eventTypes?.map((event) => (
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
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={!profile.username || !profile.name}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Booking Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
