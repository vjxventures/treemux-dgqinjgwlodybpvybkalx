# QuickCal - Simple Meeting Scheduling

A beautiful, lightweight meeting scheduler inspired by Cal.com. Built for TreeHacks 2024.

## Features

- Beautiful booking pages with custom URLs
- Availability management (set your weekly schedule)
- Real-time booking with automatic time slot generation
- Timezone detection and handling
- Dashboard for viewing bookings
- Multiple event types (15min, 30min, 1hr meetings)
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Runtime**: Bun

## Getting Started

Install dependencies:
```bash
bun install
```

Run the development server:
```bash
bun dev
```

Build for production:
```bash
bun run build
bun start
```

## How It Works

1. **Create Your Profile**: Visit the homepage and create your booking page with a custom username
2. **Set Availability**: Configure your weekly availability and working hours
3. **Share Your Link**: Share your booking page URL (e.g., quickcal.app/john-doe)
4. **Receive Bookings**: People can view your availability and book time slots
5. **Manage Bookings**: View all your bookings in the dashboard

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── setup/                # Profile setup wizard
│   └── [username]/           # Dynamic booking pages
│       ├── page.tsx          # Public booking interface
│       └── dashboard/        # User dashboard
├── components/ui/            # Reusable UI components
└── lib/
    ├── types.ts              # TypeScript types
    ├── scheduling.ts         # Time slot generation logic
    └── utils.ts              # Utility functions
```

## Key Features

### Smart Time Slot Generation
The app intelligently generates available time slots based on:
- Your weekly availability settings
- Existing bookings
- Event duration
- 15-minute intervals

### Timezone Support
Automatically detects and displays the user's timezone for accurate scheduling.

### Local Storage
Uses browser localStorage for demo purposes. In production, this would be replaced with a real database.

## Future Enhancements

- Email notifications and calendar invites
- Google Calendar integration
- Recurring availability exceptions
- Team scheduling
- Payment integration
- Custom branding
- Analytics and insights

## License

MIT
