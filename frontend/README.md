# PennyPal Frontend

A modern, responsive expense management and bill-splitting application built with Next.js, React, and TypeScript. Integrated with the PennyPal Java backend for complete financial management.

## Features

### 1. **Authentication**
- User registration and login with JWT token management
- Secure token storage in localStorage
- Automatic redirect to login for unauthenticated users
- Logout functionality that clears tokens

### 2. **Dashboard**
- Real-time expense overview with income, expenses, and balance
- Recent transactions display
- Quick navigation to all features
- Clean, professional white and blue UI

### 3. **Transaction Management**
- Add income and expense transactions
- Categorize transactions
- View all transactions with filtering (All, Income, Expenses)
- Date-based transaction tracking
- Real-time transaction list updates

### 4. **Analytics & Charts**
- Income vs Expenses bar chart over time
- Expense breakdown pie chart by category
- Visual spending pattern analysis
- Interactive charts with tooltips

### 5. **Bill Splitting**
- Create groups for bill splitting
- Add members to groups
- View all your bill shares
- Mark bill shares as settled
- Track pending and settled bills

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Fetch API
- **State Management**: React Hooks + SWR patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PennyPal Java backend running (default: http://localhost:8080)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
app/
├── page.tsx                 # Landing page
├── login/page.tsx          # Login page
├── register/page.tsx       # Registration page
├── dashboard/
│   ├── page.tsx           # Dashboard overview
│   ├── transactions/page.tsx  # Transaction management
│   ├── analytics/page.tsx     # Analytics & charts
│   └── bills/page.tsx         # Bill splitting
├── layout.tsx             # Root layout
└── globals.css            # Global styles

components/
├── dashboard-header.tsx    # Header with logout
├── dashboard-nav.tsx       # Navigation tabs
├── expense-overview.tsx    # Income/expense cards
├── recent-transactions.tsx # Recent transactions list
├── add-transaction-form.tsx # Add transaction form
├── transactions-list.tsx   # All transactions table
├── create-group-form.tsx   # Create bill group
├── groups-list.tsx         # List of groups
├── bill-shares-list.tsx    # Bill shares management
├── expense-chart.tsx       # Pie chart
└── income-vs-expense-chart.tsx # Bar chart

lib/
├── auth.ts                 # Authentication utilities
└── api.ts                  # API client functions
\`\`\`

## API Integration

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user (returns JWT token)

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions/add` - Add new transaction

### Bill Splitting
- `GET /api/bills/groups` - Get user's groups
- `POST /api/bills/groups` - Create new group
- `GET /api/bills/my-shares` - Get user's bill shares
- `POST /api/bills/split` - Create bill split
- `POST /api/bills/shares/{id}/settle` - Mark share as settled

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for all API requests
5. On logout, token is removed from localStorage
6. User is redirected to login page

## Color Scheme

The app uses a crisp white and blue theme:
- **Primary Blue**: `oklch(0.45 0.2 260)` - Main actions and highlights
- **Background**: White (`oklch(1 0 0)`)
- **Cards**: Off-white (`oklch(0.98 0 0)`)
- **Text**: Dark gray (`oklch(0.145 0 0)`)
- **Accents**: Green for income, Red for expenses

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Troubleshooting

### "Failed to fetch" errors
- Ensure your Java backend is running on `http://localhost:8080`
- Check that `NEXT_PUBLIC_API_URL` is correctly set
- Verify CORS is enabled on the backend

### Login not working
- Check that the username and password are correct
- Ensure the backend user exists
- Check browser console for error messages

### Charts not displaying
- Ensure you have transactions in the system
- Check that transaction dates are valid
- Verify Recharts is properly installed

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Export transactions to CSV
- [ ] Budget tracking and alerts
- [ ] Recurring transactions
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Transaction editing and deletion

## License

MIT

## Support

For issues or questions, please check the backend repository or contact the development team.
