# AI Ambulance Tracking & Emergency Response System - Complete Project Prompt

## PROJECT OVERVIEW

Build a comprehensive, full-stack ambulance dispatch and emergency management platform with real-time tracking, AI-powered health recommendations, and role-based admin/user interfaces. The system serves healthcare providers, emergency services, and patients with intelligent emergency response coordination.

---

## CORE REQUIREMENTS

### 1. AUTHENTICATION & AUTHORIZATION

**Authentication Method:**
- JWT-based authentication with role separation
- OAuth integration (Manus OAuth or similar)
- Session management with secure cookies
- Auto-login for demo/testing purposes

**User Roles:**
- **Admin**: Full system access, management of all resources
- **User**: Limited access to personal emergency requests and profile

**Access Control:**
- Role-based route protection
- Protected API procedures with `protectedProcedure` and `adminProcedure`
- Audit logging for all admin actions

---

## DATABASE SCHEMA

### Tables Required

#### 1. **users**
```
- id (PK, auto-increment)
- openId (unique, OAuth identifier)
- name
- email (unique)
- phone
- role (enum: 'admin', 'user')
- isBlocked (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)
- lastSignedIn (timestamp)
```

#### 2. **ambulances**
```
- id (PK)
- registrationNumber (unique)
- model
- capacity
- status (enum: 'available', 'busy', 'maintenance', 'offline')
- currentLocation (JSON: {latitude, longitude})
- fuelLevel (0-100)
- lastMaintenanceDate
- driverId (FK to drivers)
- hospitalId (FK to hospitals, current base)
- createdAt
- updatedAt
```

#### 3. **drivers**
```
- id (PK)
- name
- email
- phone
- licenseNumber (unique)
- licenseExpiry
- experience (years)
- rating (0-5)
- status (enum: 'available', 'busy', 'offline')
- ambulanceId (FK to ambulances)
- createdAt
- updatedAt
```

#### 4. **hospitals**
```
- id (PK)
- name
- address
- latitude
- longitude
- phone
- email
- totalBeds
- availableBeds
- icuBeds
- availableIcuBeds
- emergencyContactName
- emergencyContactPhone
- createdAt
- updatedAt
```

#### 5. **emergencyRequests**
```
- id (PK)
- userId (FK to users)
- patientName
- patientAge
- patientPhone
- location (JSON: {latitude, longitude, address})
- severity (enum: 'Low', 'Mild', 'Moderate', 'High', 'Critical')
- description
- status (enum: 'Request Sent', 'Ambulance Assigned', 'Driver En Route', 'Ambulance Arrived', 'Patient Picked Up', 'Reached Hospital', 'Completed', 'Cancelled')
- ambulanceId (FK to ambulances, nullable)
- driverId (FK to drivers, nullable)
- hospitalId (FK to hospitals, nullable)
- estimatedArrivalTime
- actualArrivalTime
- completedAt
- priority (1-10)
- createdAt
- updatedAt
```

#### 6. **healthMetrics**
```
- id (PK)
- emergencyRequestId (FK to emergencyRequests)
- userId (FK to users)
- heartRate (bpm)
- bloodPressureSystolic
- bloodPressureDiastolic
- spO2 (oxygen saturation %)
- temperature (Celsius)
- bloodSugar (mg/dL)
- fallDetected (boolean)
- recordedAt (timestamp)
- createdAt
```

#### 7. **emergencyContacts**
```
- id (PK)
- userId (FK to users)
- name
- phone
- relationship
- isPrimary (boolean)
- createdAt
- updatedAt
```

#### 8. **activityLogs**
```
- id (PK)
- userId (FK to users)
- action (string: describe what happened)
- resourceType (string: 'user', 'ambulance', 'emergency', etc.)
- resourceId
- details (JSON)
- ipAddress
- createdAt
```

#### 9. **notifications**
```
- id (PK)
- userId (FK to users)
- type (enum: 'emergency_alert', 'ambulance_assigned', 'health_advisory', 'system_notification')
- title
- message
- isRead (boolean)
- relatedEmergencyId (FK, nullable)
- createdAt
- readAt (nullable)
```

#### 10. **reports**
```
- id (PK)
- generatedBy (FK to users, admin only)
- reportType (enum: 'daily', 'weekly', 'monthly', 'emergency', 'utilization')
- startDate
- endDate
- reportData (JSON: contains statistics and metrics)
- exportFormat (enum: 'pdf', 'excel', 'csv')
- fileUrl (S3 link)
- createdAt
```

---

## BACKEND API SPECIFICATIONS

### Technology Stack
- **Framework**: Express.js 4.x
- **API Protocol**: tRPC 11.x
- **Database ORM**: Drizzle ORM
- **Database**: MySQL/TiDB
- **Validation**: Zod
- **Authentication**: JWT + Manus OAuth

### API Procedures (tRPC Routers)

#### **auth** Router
```typescript
auth.me() → User | null
auth.logout() → { success: boolean }
```

#### **dashboard** Router (Admin)
```typescript
dashboard.getStats() → {
  totalUsers: number
  totalAmbulances: number
  activeEmergencies: number
  completedCases: number
  pendingRequests: number
  criticalPatients: number
  onlineAmbulances: number
  availableAmbulances: number
  busyAmbulances: number
}

dashboard.getRecentActivity() → Activity[]
```

#### **users** Router (Admin)
```typescript
users.list(limit?: number, offset?: number) → User[]
users.search(query: string) → User[]
users.getById(id: number) → User
users.create(data: CreateUserInput) → User
users.update(id: number, data: UpdateUserInput) → User
users.delete(id: number) → { success: boolean }
users.updateRole(id: number, role: 'admin' | 'user') → User
users.block(id: number) → User
users.unblock(id: number) → User
users.resetPassword(id: number) → { tempPassword: string }
users.filter(filters: UserFilters) → User[]
```

#### **ambulances** Router (Admin)
```typescript
ambulances.list() → Ambulance[]
ambulances.getById(id: number) → Ambulance
ambulances.create(data: CreateAmbulanceInput) → Ambulance
ambulances.update(id: number, data: UpdateAmbulanceInput) → Ambulance
ambulances.delete(id: number) → { success: boolean }
ambulances.updateStatus(id: number, status: AmbulanceStatus) → Ambulance
ambulances.updateLocation(id: number, lat: number, lng: number) → Ambulance
ambulances.updateFuelLevel(id: number, level: number) → Ambulance
ambulances.recordMaintenance(id: number, details: string) → Ambulance
ambulances.getAvailable() → Ambulance[]
ambulances.getMaintenanceHistory(id: number) → MaintenanceRecord[]
```

#### **drivers** Router (Admin)
```typescript
drivers.list() → Driver[]
drivers.getById(id: number) → Driver
drivers.create(data: CreateDriverInput) → Driver
drivers.update(id: number, data: UpdateDriverInput) → Driver
drivers.delete(id: number) → { success: boolean }
drivers.assignAmbulance(driverId: number, ambulanceId: number) → Driver
drivers.updateStatus(id: number, status: DriverStatus) → Driver
drivers.getAssignmentHistory(id: number) → Assignment[]
drivers.rateDriver(id: number, rating: number) → Driver
```

#### **hospitals** Router (Admin)
```typescript
hospitals.list() → Hospital[]
hospitals.getById(id: number) → Hospital
hospitals.create(data: CreateHospitalInput) → Hospital
hospitals.update(id: number, data: UpdateHospitalInput) → Hospital
hospitals.delete(id: number) → { success: boolean }
hospitals.updateBedAvailability(id: number, available: number, icu: number) → Hospital
hospitals.getNearby(lat: number, lng: number, radiusKm: number) → Hospital[]
```

#### **emergencies** Router
```typescript
// User procedures
emergencies.create(data: CreateEmergencyInput) → EmergencyRequest
emergencies.getMyEmergencies() → EmergencyRequest[]
emergencies.getById(id: number) → EmergencyRequest
emergencies.cancelRequest(id: number) → EmergencyRequest

// Admin procedures
emergencies.list() → EmergencyRequest[]
emergencies.search(query: string) → EmergencyRequest[]
emergencies.updateStatus(id: number, status: EmergencyStatus) → EmergencyRequest
emergencies.assignAmbulance(emergencyId: number, ambulanceId: number) → EmergencyRequest
emergencies.getActive() → EmergencyRequest[]
emergencies.getByStatus(status: EmergencyStatus) → EmergencyRequest[]
emergencies.changePriority(id: number, priority: number) → EmergencyRequest
emergencies.getByDateRange(startDate: Date, endDate: Date) → EmergencyRequest[]
```

#### **healthMetrics** Router
```typescript
healthMetrics.create(data: CreateHealthMetricsInput) → HealthMetrics
healthMetrics.getByEmergency(emergencyId: number) → HealthMetrics[]
healthMetrics.getUserMetrics(userId: number) → HealthMetrics[]
healthMetrics.getLatestForUser(userId: number) → HealthMetrics
healthMetrics.getAIRecommendation(metricsId: number) → AIRecommendation
```

#### **emergencyContacts** Router
```typescript
emergencyContacts.list() → EmergencyContact[]
emergencyContacts.create(data: CreateContactInput) → EmergencyContact
emergencyContacts.update(id: number, data: UpdateContactInput) → EmergencyContact
emergencyContacts.delete(id: number) → { success: boolean }
emergencyContacts.setPrimary(id: number) → EmergencyContact
emergencyContacts.callContact(id: number) → { success: boolean }
emergencyContacts.sendSOS(contactId: number, location: Location) → { success: boolean }
```

#### **reports** Router (Admin)
```typescript
reports.generate(data: GenerateReportInput) → Report
reports.list() → Report[]
reports.getById(id: number) → Report
reports.export(id: number, format: 'pdf' | 'excel' | 'csv') → { url: string }
reports.getDailyStats(date: Date) → DailyStats
reports.getMonthlyStats(month: number, year: number) → MonthlyStats
reports.getUtilizationStats() → UtilizationStats
```

#### **notifications** Router
```typescript
notifications.list() → Notification[]
notifications.getUnread() → Notification[]
notifications.markAsRead(id: number) → Notification
notifications.delete(id: number) → { success: boolean }
notifications.send(userId: number, data: NotificationData) → Notification
```

---

## FRONTEND SPECIFICATIONS

### Technology Stack
- **Framework**: React 19.x with TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Icons**: Lucide React
- **Charts**: Recharts
- **Maps**: Google Maps API

### Page Structure

#### **Public Pages** (Unauthenticated Users)
1. **Landing Page** (`/`)
   - Hero section with features overview
   - Call-to-action buttons
   - Feature highlights with icons
   - Statistics section
   - Footer with links

#### **Admin Pages** (Role: Admin)
1. **Dashboard** (`/`)
   - Summary cards (users, ambulances, emergencies, completed cases)
   - Daily emergency statistics chart
   - Ambulance status distribution chart
   - Recent activity feed
   - Quick action buttons

2. **User Management** (`/admin/users`)
   - Search and filter users
   - CRUD operations
   - Block/unblock users
   - Change user roles
   - View user details

3. **Ambulance Management** (`/admin/ambulances`)
   - List all ambulances
   - View ambulance status and location
   - Assign drivers
   - Update fuel level
   - View maintenance history
   - Create/edit ambulances

4. **Driver Management** (`/admin/drivers`)
   - List all drivers
   - View driver assignments
   - Update driver status
   - View driver ratings
   - Create/edit drivers

5. **Hospital Management** (`/admin/hospitals`)
   - List all hospitals
   - Update bed availability
   - View emergency contacts
   - Create/edit hospitals
   - View nearby hospitals

6. **Emergency Management** (`/admin/emergencies`)
   - List all emergency requests
   - Filter by status and severity
   - Assign ambulances to emergencies
   - Update emergency status
   - View emergency details
   - Change priority levels

7. **Reports** (`/admin/reports`)
   - Generate daily/weekly/monthly reports
   - View emergency statistics
   - Export as PDF, Excel, CSV
   - View utilization metrics
   - Filter by date range

8. **Settings** (`/admin/settings`)
   - System configuration
   - User management settings
   - Notification preferences
   - API key management

#### **User Pages** (Role: User)
1. **Emergency Dashboard** (`/`)
   - Current emergency status
   - Assigned ambulance information
   - Driver details and ETA
   - Nearby hospitals
   - Emergency contacts quick access
   - Request ambulance button

2. **Live Tracking** (`/tracking/:emergencyId`)
   - Interactive map with real-time ambulance location
   - User location marker
   - Hospital destination marker
   - Route visualization
   - ETA and distance remaining
   - Traffic status
   - Driver contact button

3. **Emergency Contacts** (`/emergency-contacts`)
   - List of emergency contacts
   - Add/edit/delete contacts
   - Mark primary contact
   - One-tap call actions
   - Share live location button
   - Send SOS message

4. **Profile** (`/profile`)
   - User information
   - Health metrics history
   - Emergency history
   - Account settings
   - Logout button

### UI Components to Build

#### Shared Components
- `DashboardLayout` - Main layout with sidebar navigation
- `Card` - Reusable card component
- `Button` - Button with variants
- `Input` - Form input field
- `Select` - Dropdown selector
- `Modal/Dialog` - Modal dialogs
- `Table` - Data table with sorting/filtering
- `Chart` - Chart components (line, bar, pie)
- `Map` - Google Maps integration
- `Toast/Notification` - Toast notifications
- `Spinner/Skeleton` - Loading states
- `Badge` - Status badges
- `Tabs` - Tab navigation

#### Custom Components
- `StatCard` - Dashboard statistic card
- `EmergencyStatusBadge` - Status indicator
- `SeverityBadge` - Severity level indicator
- `AmbulanceStatusIndicator` - Ambulance status display
- `LiveMap` - Real-time tracking map
- `HealthMetricsChart` - Health data visualization
- `ActivityFeed` - Activity log display
- `EmergencyForm` - Emergency request creation form

---

## FEATURE SPECIFICATIONS

### 1. EMERGENCY REQUEST LIFECYCLE

**Exact Status Sequence** (Must follow in order):
1. `Request Sent` - User initiates emergency request
2. `Ambulance Assigned` - Admin assigns ambulance to request
3. `Driver En Route` - Driver begins traveling to patient
4. `Ambulance Arrived` - Ambulance reaches patient location
5. `Patient Picked Up` - Patient loaded into ambulance
6. `Reached Hospital` - Ambulance arrives at hospital
7. `Completed` - Emergency case closed
8. `Cancelled` - Request cancelled by user or admin

**Status Transitions:**
- Can only move forward in sequence
- Admin can skip to later stages if needed
- Cannot go backwards
- Cancellation possible from any stage

### 2. EMERGENCY SEVERITY CLASSIFICATION

**Five Severity Levels** (Exact labels required):
1. **Low** - Minor injuries, non-urgent
2. **Mild** - Moderate discomfort, can wait
3. **Moderate** - Significant symptoms, needs attention
4. **High** - Serious condition, urgent
5. **Critical** - Life-threatening, immediate action required

**AI Recommendation Logic:**
- Analyze health metrics
- Calculate severity score (0-100)
- Map to severity level
- Provide first-aid guidance
- Suggest nearest appropriate hospital

### 3. HEALTH METRICS TRACKING

**Six Required Metrics** (Exact list):
1. **Heart Rate** (bpm, normal: 60-100)
2. **Blood Pressure** (mmHg, systolic/diastolic, normal: 120/80)
3. **SpO₂** (%, normal: 95-100)
4. **Temperature** (°C, normal: 36.5-37.5)
5. **Blood Sugar** (mg/dL, normal: 70-100 fasting)
6. **Fall Detection** (boolean, yes/no)

**Health Advisory System:**
- Monitor metrics in real-time
- Alert if values abnormal
- Provide health recommendations
- Track trends over time
- Generate health reports

### 4. NEARBY ASSISTANCE FINDER

**Location Types to Display:**
- Hospitals (with bed availability)
- Clinics
- Pharmacies
- Blood Banks
- Police Stations
- Fire Stations

**Information per Location:**
- Name and address
- Distance from user
- ETA (estimated time)
- Contact number
- Navigation button (Google Maps)
- Open/closed status

### 5. EMERGENCY CONTACTS

**One-Tap Actions** (All five required):
1. **Call Family** - Dial family contact
2. **Call Doctor** - Dial doctor contact
3. **Call Ambulance** - Initiate emergency request
4. **Share Live Location** - Send location link via SMS/WhatsApp
5. **Send SOS Message** - Send pre-defined SOS message

### 6. REPORTING & EXPORTS

**Report Types:**
- Daily Report - Day's emergency statistics
- Weekly Report - Week's overview
- Monthly Report - Month's comprehensive report
- Emergency Report - Specific emergency details
- Utilization Report - Fleet and resource usage

**Export Formats** (All three required):
- **PDF** - Professional formatted document
- **Excel** - Spreadsheet with charts
- **CSV** - Raw data export

**Report Data:**
- Total emergencies
- Emergencies by severity
- Average response time
- Completed vs pending
- Ambulance utilization
- Driver performance
- Hospital statistics
- Revenue/cost metrics

### 7. NOTIFICATIONS

**Notification Types:**
- Emergency alerts (new emergency requests)
- Ambulance assignments (driver assigned)
- Status updates (emergency status changes)
- Health advisories (abnormal metrics)
- System notifications (maintenance, updates)

**Delivery Methods:**
- In-app toast notifications
- Push notifications (if PWA)
- Email notifications (optional)
- SMS alerts (optional)

### 8. REAL-TIME TRACKING

**Map Features:**
- Live ambulance location (GPS)
- Patient location marker
- Hospital destination marker
- Route visualization
- ETA calculation
- Distance remaining
- Traffic status integration
- Driver contact info
- Estimated arrival time updates

---

## DESIGN SPECIFICATIONS

### Color Palette
- **Primary Red**: `#ef4444` - Emergency/urgent actions
- **Primary Blue**: `#3b82f6` - Primary actions
- **Success Green**: `#10b981` - Positive states
- **Warning Orange**: `#f59e0b` - Warnings
- **Neutral Gray**: `#6b7280` - Secondary text
- **Background**: `#ffffff` - Light theme
- **Dark Background**: `#1f2937` - Dark theme

### Typography
- **Headings**: Bold, 24-32px
- **Subheadings**: Semibold, 18-20px
- **Body**: Regular, 14-16px
- **Small**: Regular, 12-13px
- **Font Family**: Inter, system fonts

### Spacing
- Base unit: 4px
- Padding: 8px, 12px, 16px, 24px, 32px
- Margins: 8px, 12px, 16px, 24px, 32px
- Gap: 8px, 12px, 16px, 24px

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Database schema creation
- [ ] Backend API setup (tRPC)
- [ ] Authentication implementation
- [ ] Basic CRUD operations

### Phase 2: Admin Features
- [ ] Admin dashboard
- [ ] User management panel
- [ ] Ambulance management
- [ ] Driver management
- [ ] Hospital management

### Phase 3: User Features
- [ ] User dashboard
- [ ] Emergency request creation
- [ ] Emergency contacts management
- [ ] Profile page

### Phase 4: Advanced Features
- [ ] Live tracking map
- [ ] AI health recommendations
- [ ] Nearby assistance finder
- [ ] Emergency lifecycle management

### Phase 5: Reporting & Notifications
- [ ] Report generation
- [ ] PDF/Excel/CSV export
- [ ] Notification system
- [ ] Push notifications

### Phase 6: Polish & Deployment
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing & QA
- [ ] Deployment

---

## TECHNICAL REQUIREMENTS

### Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Real-time updates: < 1 second latency
- Database queries: < 100ms

### Security
- HTTPS/TLS encryption
- SQL injection prevention (Drizzle ORM)
- XSS protection (React)
- CSRF tokens for state-changing operations
- Rate limiting on API endpoints
- Input validation (Zod)
- Secure password hashing (bcrypt)
- JWT expiration and refresh tokens

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Focus indicators

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

---

## DEPLOYMENT

### Hosting
- Frontend: Vercel, Netlify, or similar
- Backend: Node.js server (Heroku, Railway, etc.)
- Database: Managed MySQL/TiDB (PlanetScale, AWS RDS)
- Storage: AWS S3 for file uploads

### Environment Variables
```
DATABASE_URL=mysql://...
JWT_SECRET=your-secret-key
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRET=...
GOOGLE_MAPS_API_KEY=...
NODE_ENV=production
```

---

## ADDITIONAL NOTES

- Use TypeScript throughout for type safety
- Follow REST/tRPC best practices
- Implement comprehensive error handling
- Add logging for debugging
- Create unit tests for critical functions
- Document API endpoints
- Follow DRY (Don't Repeat Yourself) principle
- Optimize database queries
- Implement caching where appropriate
- Use environment variables for configuration

---

**Document Version**: 1.0
**Last Updated**: August 9, 2026
**Status**: Complete Specification Ready for Implementation
