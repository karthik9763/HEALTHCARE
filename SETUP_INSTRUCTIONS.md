# Ambulance Tracking & Emergency Response System - Setup Guide

## 📦 What's Included

This is a complete **AI-powered ambulance dispatch and emergency management platform** with:

### ✅ Completed Features
- **Database**: 10 tables with complete schema (users, ambulances, drivers, hospitals, emergencies, health metrics, etc.)
- **Backend API**: 50+ tRPC procedures with role-based access control
- **Admin Dashboard**: Statistics, charts, activity feed, user management
- **User Dashboard**: Emergency request creation and tracking
- **Authentication**: Manus OAuth with role-based routing
- **Professional Landing Page**: Features, benefits, and call-to-action
- **Responsive UI**: Built with React, TypeScript, Tailwind CSS

### 🚀 Quick Start

#### 1. Extract the Archive
```bash
# On Windows, use 7-Zip, WinRAR, or built-in extraction
# Extract ambulance_tracking_system_latest.tar.gz to your desired location
```

#### 2. Install Dependencies
```bash
cd ambulance_tracking_system
pnpm install
```

#### 3. Start Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 🔐 Authentication

**Login Method**: Manus OAuth
- Click "Sign In" button on the landing page
- Sign in with your Manus account
- First user automatically becomes Admin
- Subsequent users are regular Users

### 📁 Project Structure

```
ambulance_tracking_system/
├── client/                    # React frontend
│   └── src/
│       ├── pages/            # Page components (admin & user)
│       ├── components/       # Reusable UI components
│       └── lib/              # tRPC client setup
├── server/                   # Node.js backend
│   ├── routers.ts           # tRPC procedures (API endpoints)
│   ├── db.ts                # Database query helpers
│   └── _core/               # Core framework files
├── drizzle/                 # Database schema & migrations
│   └── schema.ts            # Table definitions
└── package.json             # Dependencies
```

### 🗄️ Database

The system uses **MySQL/TiDB** with these tables:
- `users` - User accounts with roles (admin/user)
- `ambulances` - Fleet management
- `drivers` - Driver information and assignments
- `hospitals` - Hospital network and bed availability
- `emergencyRequests` - Emergency cases with status lifecycle
- `healthMetrics` - Patient health data (heart rate, BP, SpO₂, etc.)
- `emergencyContacts` - User's emergency contacts
- `activityLogs` - Audit trail
- `notifications` - Push notifications
- `reports` - Generated reports (PDF, Excel, CSV)

### 🎯 Key Features

#### Admin Panel
- Dashboard with real-time statistics
- User management (search, filter, block/unblock, role changes)
- Ambulance management (status, location, fuel tracking)
- Driver management (assignment, history, ratings)
- Hospital management (bed availability, emergency contacts)
- Emergency request management (accept, reject, assign ambulances)
- Live tracking map
- Reports and analytics
- System settings

#### User Dashboard
- Emergency status overview
- Assigned ambulance information
- Driver details and ETA
- Nearby hospitals
- Emergency contacts with one-tap actions
- Live ambulance tracking
- Health metrics monitoring
- AI-powered health recommendations

### 🔧 Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build           # Build for production
pnpm start           # Start production server

# Testing & Quality
pnpm check           # TypeScript type checking
pnpm test            # Run tests
pnpm format          # Format code

# Database
pnpm drizzle-kit generate   # Generate migrations
pnpm drizzle-kit migrate    # Apply migrations
```

### 📊 API Endpoints (tRPC)

All API calls are through tRPC at `/api/trpc`:

**Authentication**
- `auth.me` - Get current user
- `auth.logout` - Logout

**Dashboard**
- `dashboard.getStats` - Get dashboard statistics
- `dashboard.getRecentActivity` - Get recent activity feed

**Users** (Admin only)
- `users.list` - List all users
- `users.search` - Search users
- `users.updateRole` - Change user role
- `users.block/unblock` - Block/unblock users

**Ambulances** (Admin)
- `ambulances.list` - List all ambulances
- `ambulances.create` - Add new ambulance
- `ambulances.updateStatus` - Change ambulance status
- `ambulances.updateLocation` - Update GPS location

**Emergency Requests**
- `emergencies.create` - Create emergency request (User)
- `emergencies.list` - List all emergencies (Admin)
- `emergencies.assignAmbulance` - Assign ambulance (Admin)
- `emergencies.updateStatus` - Update emergency status (Admin)

**Health Metrics**
- `healthMetrics.create` - Record health data
- `healthMetrics.getUserMetrics` - Get user's health history

**Emergency Contacts**
- `emergencyContacts.list` - Get user's emergency contacts
- `emergencyContacts.create` - Add emergency contact
- `emergencyContacts.delete` - Remove emergency contact

### 🎨 Design

- **Color Scheme**: Professional medical theme (white, blue, red accents)
- **Layout**: Responsive design for desktop and mobile
- **Components**: Built with shadcn/ui and Tailwind CSS
- **Icons**: Lucide React icons throughout

### 📝 Environment Variables

The system automatically configures:
- `DATABASE_URL` - Database connection
- `JWT_SECRET` - Session signing key
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL

### 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

**Dependencies issues:**
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Database connection:**
- Ensure MySQL/TiDB is running
- Check DATABASE_URL in environment

### 📚 Next Steps

1. Extract and install the project
2. Start the development server
3. Sign in with your Manus account
4. Explore the admin dashboard
5. Test emergency request creation
6. Review the database schema in `drizzle/schema.ts`

### 📞 Support

For issues or questions:
- Check the README in the project root
- Review the database schema in `drizzle/schema.ts`
- Check the API procedures in `server/routers.ts`
- Review frontend pages in `client/src/pages/`

---

**Version**: 865178cb (Latest)
**Last Updated**: August 9, 2026
