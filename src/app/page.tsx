'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Link2, Zap } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');

  const handleCreateBookingPage = () => {
    if (username.trim()) {
      window.location.href = `/setup?username=${encodeURIComponent(username)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">QuickCal</span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/setup'}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Scheduling made{' '}
              <span className="text-blue-600">simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your availability, let people book time with you.
              No more back-and-forth emails.
            </p>
          </div>

          {/* Quick Start Card */}
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Create Your Booking Page</CardTitle>
              <CardDescription>Get started in seconds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="your-name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBookingPage()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    quickcal.app/{username || 'your-name'}
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateBookingPage}
                disabled={!username.trim()}
              >
                Create My Page
              </Button>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Smart Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Set your weekly hours and automatically show available times
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Timezone Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Automatically handles timezones for global scheduling
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Link2 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Shareable Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Beautiful booking pages you can share anywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
