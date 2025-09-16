# Roomi - Roommate Budgeting App

A full-stack web app that helps roommates manage shared expenses, chores, events, and adds gamification to make money management fun and social.

## Features

### Core Functionality
- **Home Dashboard**: Daily tasks, balances, featured events, quick actions
- **Expense Splitting**: Upload receipts via camera/gallery/voice, AI parsing, split with roommates
- **Chat System**: Group chat, direct messages, landlord communication
- **Events & Calendar**: Create events, RSVP system, cost splitting
- **Chores Management**: Assign chores, track completion, rotation system
- **Leaderboard**: Points system, "Roommate of the Week", gamification
- **House Rules**: Shared agreements, commissioner mode
- **Landlord Info**: Contact details, quick communication

### AI Integration
- **Transaction Parsing**: GPT-4o extracts date, amount, description from receipts
- **Voice Input**: Whisper API for voice-to-text expense entry
- **Smart Categorization**: Automatic expense categorization

### Fun Features
- **Buy You a Beer**: Alternative repayment in beers, pizzas, coffees
- **Gamification**: Points for good behavior, forfeits for bad behavior
- **Social Elements**: Chat nudges, polls, notifications

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (GPT-4o, Whisper)
- **Hosting**: Vercel
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd roomi-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
- Create a new Supabase project
- Run the SQL schema from `supabase-schema.sql`
- Enable Row Level Security (RLS)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chats/             # Chat screens
│   ├── leaderboard/       # Leaderboard screen
│   ├── plus/              # Add expense/event screen
│   ├── rules/             # House rules screen
│   └── info/              # Landlord info screen
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── screens/          # Screen components
│   ├── modals/           # Modal components
│   └── ui/               # UI components
└── lib/                  # Utilities and configurations
    ├── supabase.ts       # Database client and types
    ├── openai.ts         # AI integration
    └── utils.ts          # Helper functions
```

## Key Features Implementation

### Expense Upload & Parsing
1. User selects camera/gallery/voice input
2. AI parses transaction details
3. Review modal with editable table
4. Select roommates to split with
5. Accept slider → Batch ID assigned → balances updated

### Gamification System
- Points for: paying on time (+10), chores (+5), cooking (+8)
- Points lost for: skipping chores (-5), late payments (-10)
- Weekly/monthly cycles with automatic reset
- "Roommate of the Week" and "Forfeit Roommate" announcements

### Chat & Communication
- Group chat with pinned messages and polls
- Direct messages with balance display and nudge buttons
- Landlord chat with quick contact actions
- System notifications for expenses, events, chores

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@roomi.app or create an issue in the repository.