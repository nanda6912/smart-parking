# 🅿️ SmartPark - Parking Management System

A modern Single Page Application (SPA) that automates the complete lifecycle of parking — from slot selection at entry to billing and slot release at exit. Features real-time synchronization, smooth navigation, and automatic refresh capabilities.

## ✨ Latest Features & Updates

### 🔄 Single Page Application
- **SPA Architecture**: Seamless navigation without page reloads
- **Navigation Bar**: Easy switching between Entrance, Exit, and Admin pages
- **Smooth Transitions**: Modern user experience with React Router v6
- **Consistent Interface**: Navigation available on all pages

### 🔄 Real-Time Synchronization
- **Instant Updates**: Bookings immediately reflect across all pages
- **Auto-Refresh**: Exit Counter and Admin Dashboard automatically refresh when new bookings occur
- **State Persistence**: Consistent data across page refreshes and browser sessions
- **Cross-Page Communication**: Seamless data flow between all pages

### 🎯 Three-Page Architecture
- **Entrance Kiosk (/)** - Driver-facing booking interface
- **Exit Counter (/exit)** - Staff-facing exit processing with real-time updates
- **Admin Dashboard (/admin)** - Management analytics with auto-refresh

### 🔧 Technical Improvements
- **useReducer Pattern**: Robust state management with predictable updates
- **localStorage Integration**: Reliable data persistence with proper error handling
- **NaN Protection**: Fixed revenue calculations and statistics
- **Clean Architecture**: Production-ready codebase with no unnecessary files

## Features

- **Single Page Application**: Smooth navigation without page reloads
- **Navigation Bar**: Easy switching between all pages
- **Real-time Slot Management**: 8 parking slots (4 Ground + 4 First Floor)
- **Color-coded Interface**: Green (available) and Red (occupied) slots
- **PDF Ticket Generation**: Professional tickets with all details
- **Automated Billing**: ₹20/hour with ceiling calculation
- **Auto-Refresh Pages**: Exit Counter and Admin Dashboard update automatically
- **Persistent State**: localStorage for data persistence across sessions
- **Responsive Design**: Dark theme optimized for kiosk screens
- **Revenue Analytics**: Real-time revenue tracking without NaN values

## Technology Stack

- **Frontend**: React.js with Hooks (useReducer, useEffect, useContext)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (SPA navigation)
- **PDF Generation**: jsPDF
- **State Management**: React Context API + useReducer + localStorage
- **Deployment**: Vercel (Free Tier)

## Project Structure

```
smart-parking/
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
├── 📄 .gitignore
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 vercel.json
├── 📁 public/
│   ├── 📄 favicon.ico
│   ├── 📄 index.html
│   ├── 📄 logo192.png
│   ├── 📄 logo512.png
│   ├── 📄 manifest.json
│   └── 📄 robots.txt
├── 📁 src/
│   ├── 📄 App.js                    ← Main app with routing and navigation
│   ├── 📄 index.js                  ← Entry point
│   ├── 📄 index.css                 ← Global styles
│   ├── 📁 components/
│   │   ├── 📄 Navigation.jsx        ← Navigation bar component
│   │   ├── 📄 BookingModal.jsx      ← Vehicle registration modal
│   │   └── 📄 SlotCard.jsx          ← Individual slot component
│   ├── 📁 context/
│   │   └── 📄 ParkingContext.jsx    ← Global state management
│   ├── 📁 pages/
│   │   ├── 📄 EntranceKiosk.jsx     ← Driver booking (route: /)
│   │   ├── 📄 ExitCounter.jsx       ← Staff exit processing (route: /exit)
│   │   └── 📄 AdminDashboard.jsx    ← Management analytics (route: /admin)
│   └── 📁 utils/
│       ├── 📄 billing.js            ← Billing calculation utilities
│       └── 📄 pdfGenerator.js       ← PDF ticket generation
└── 📁 build/ (generated on build)
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/nanda6912/smart-parking.git
cd smart-parking
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The application will open at http://localhost:3000

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Application Usage

### Navigation
The application features a navigation bar on all pages with:
- **🅿️ SmartPark** - Returns to entrance page
- **🚗 Entrance** - Driver booking interface
- **🚪 Exit** - Staff exit processing
- **📊 Admin** - Management analytics

### Entrance Kiosk (/) - Driver-Facing
- **Purpose**: Vehicle entry and slot booking
- **Features**: 
  - Visual slot grid showing availability (green = available, red = occupied)
  - Click-to-book functionality with modal form
  - Vehicle number and phone validation
  - PDF ticket generation with all details
  - Real-time slot status updates
- **User Flow**: Driver selects slot → Enters details → Receives ticket

### Exit Counter (/exit) - Staff-Facing
- **Purpose**: Vehicle exit processing and payment collection
- **Features**:
  - Real-time display of all active parked vehicles
  - **Auto-refresh**: Page automatically updates when new bookings occur
  - Click-to-process workflow (no manual typing needed)
  - Live billing calculations updating every 3 seconds
  - Quick action buttons for instant slot release
  - Manual Ticket ID search as backup option
- **User Flow**: Staff sees active vehicles → Clicks vehicle → Confirms exit → Collects payment

### Admin Dashboard (/admin) - Management-Facing
- **Purpose**: Business analytics and system monitoring
- **Features**:
  - Revenue tracking (daily, weekly, monthly) with fixed NaN calculations
  - Occupancy rate monitoring
  - Average parking duration analytics
  - Recent activity logs
  - Real-time slot status grid
  - **Auto-refresh**: Page automatically updates when new bookings occur
- **User Flow**: Admin views analytics → Monitors system performance → Generates reports

## Billing Logic

The system uses ceiling-based hourly calculation:
- 1-59 minutes = 1 hour = ₹20
- 61-119 minutes = 2 hours = ₹40
- 121+ minutes = 3+ hours = ₹60+

Formula: `Math.ceil(durationMinutes / 60) * 20` (minimum ₹20)

## State Management Architecture

### Context Provider Structure
```javascript
<ParkingProvider>
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<EntranceKiosk />} />
      <Route path="/exit" element={<ExitCounter />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </Router>
</ParkingProvider>
```

### Reducer Actions
- `BOOK_SLOT`: Updates slot status and adds ticket to array
- `RELEASE_SLOT`: Frees slot and marks ticket as completed
- `LOAD_STATE`: Initializes state from localStorage

### Auto-Refresh Mechanism
- Monitors ticket count changes every 2 seconds
- Automatically refreshes pages when new bookings detected
- Uses localStorage for cross-page communication

## Deployment

### Vercel Deployment

1. Push to GitHub repository
2. Go to https://vercel.com and sign in with GitHub
3. Click "New Project" and import your repository
4. Vercel will auto-detect React and configure settings
5. Click "Deploy" - your app will be live in ~60 seconds

### vercel.json Configuration
```json
{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}
```

### Manual Deployment

```bash
npm run build
# The build folder is ready for deployment
```

## Data Persistence

The application uses localStorage to maintain:
- Parking slot status
- Active tickets
- Booking history
- Auto-refresh tracking data

Data persists across page refreshes and browser sessions with proper error handling and NaN protection.

## Recent Bug Fixes

### ✅ Fixed Issues
- **Real-time Updates**: Resolved context sharing issues between pages
- **localStorage Consistency**: Fixed dual key problem (parkingState vs smartpark)
- **Revenue NaN Values**: Fixed billing calculations with proper error handling
- **State Persistence**: Resolved GlobalState singleton issues
- **Auto-Refresh**: Implemented automatic page updates for staff pages
- **SPA Routing**: Fixed vercel.json to handle all routes properly

### 🔧 Technical Improvements
- Replaced GlobalState singleton with useReducer pattern
- Added comprehensive error handling for billing calculations
- Implemented NaN protection in all statistical calculations
- Removed debug code for production optimization
- Added automatic refresh functionality for better UX
- Converted to Single Page Application with smooth navigation
- Cleaned up project structure removing unnecessary files

## Future Enhancements

### 🚀 High Priority
- **Multi-Device Sync**: Backend integration for real-time synchronization across devices
- **QR Code Integration**: Generate QR codes on tickets for faster scanning
- **SMS Notifications**: Send booking confirmations and exit notifications via Twilio API
- **Payment Gateway Integration**: Support for digital payments (UPI, Credit Cards)

### 📊 Analytics & Reporting
- **Advanced Analytics**: Peak hour analysis, revenue trends, customer patterns
- **Export Features**: CSV/PDF reports for accounting and business analysis
- **Customer Database**: Regular customer tracking and loyalty programs
- **Occupancy Forecasting**: AI-powered predictions for busy periods

### 🏗️ Infrastructure
- **Multiple Parking Lots**: Support for managing multiple locations
- **Physical Integration**: Barrier gate control systems and hardware integration
- **Mobile App**: Native mobile applications for staff and customers
- **Cloud Backend**: Firebase/Supabase for real-time database

### 🎨 User Experience
- **Multi-language Support**: Internationalization for diverse users
- **Accessibility Features**: Screen reader support and keyboard navigation
- **Dark/Light Theme**: Theme switching for different environments
- **Offline Mode**: PWA capabilities for intermittent connectivity

### 🔒 Security & Compliance
- **User Authentication**: Staff login system with role-based access
- **Audit Logs**: Comprehensive logging for security and compliance
- **Data Encryption**: Enhanced security for customer data
- **GDPR Compliance**: Data privacy and user consent management

## License

This project is licensed under the MIT License.

---

**SmartPark** - Built with React.js • Single Page Application • Real-time Synchronization • Production Ready

*Last Updated: February 2026 - Version 3.0 with SPA Architecture and Clean Project Structure*
