# React Native Caregiver Dashboard Feature

## Overview

This document describes the React Native implementation of the caregiver dashboard feature from the Flutter app. The dashboard provides a comprehensive overview of patients, appointments, and messages with KPI cards and detailed patient lists.

## Architecture

### File Structure

```
src/
├── contexts/
│   ├── DashboardContext.js          # Dashboard state and data management
│   └── ...
├── models/
│   ├── Patient.js                   # Patient model and criticality enum
│   └── CaregiverMessage.js          # Message model
├── repositories/
│   ├── PatientsRepository.js        # Patient data and sorting logic
│   └── MessagesRepository.js        # Message data management
├── screens/
│   ├── CaregiverDashboardScreen.js  # Main dashboard screen
│   ├── components/
│   │   ├── StatCard.js              # KPI card component
│   │   ├── PatientRow.js            # Patient list row component
│   │   └── SectionHeader.js         # Section title component
│   └── ... (other screens)
├── utils/
│   └── dtFormat.js                  # Date formatting utilities
└── ...

App.js                              # Main app with dashboard navigation
```

## Components

### 1. Data Models

#### Patient Model (`src/models/Patient.js`)
Represents a patient with personal and medical information.

```javascript
const PatientCriticality = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

class Patient {
  constructor(firstName, lastName, criticality = null, nextVisit = null)
  get fullName()  // Returns "FirstName LastName"
}
```

#### CaregiverMessage Model (`src/models/CaregiverMessage.js`)
Represents a message for the caregiver.

```javascript
class CaregiverMessage {
  constructor(id, sender, subject, preview, sentAt, unread = false)
}
```

### 2. Repositories

#### PatientsRepository (`src/repositories/PatientsRepository.js`)

Manages patient data with sorting and filtering capabilities.

**Key Methods**:
- `allPatients()` - Returns all patients
- `needingAttentionSorted()` - Returns patients needing attention, sorted by criticality
- `upcomingVisitsSorted()` - Returns patients with upcoming visits, sorted by visit time
- `topNeedingAttention(n)` - Returns top N patients needing attention
- `topUpcomingVisits(n)` - Returns top N patients with upcoming visits

**Sorting Logic**:
- Criticality order: CRITICAL > HIGH > MEDIUM > LOW
- Within same criticality: earlier visit first (if present), then alphabetically by last name

#### MessagesRepository (`src/repositories/MessagesRepository.js`)

Manages caregiver messages.

**Key Methods**:
- `allMessages()` - Returns all messages
- `unreadMessages()` - Returns unread messages
- `unreadCount()` - Returns number of unread messages

### 3. DashboardContext (`src/contexts/DashboardContext.js`)

Provides dashboard data and operations to components.

**Exported Hook**:
```javascript
const {
  // Data
  allPatients,
  needingAttention,      // Top 3
  upcomingVisits,        // Top 3
  unreadMessageCount,
  
  // Statistics
  totalPatients,
  totalUpcomingVisits,
  totalNeedingAttention,
  
  // Repository access
  patientsRepository,
  messagesRepository,
} = useDashboard();
```

### 4. CaregiverDashboardScreen (`src/screens/CaregiverDashboardScreen.js`)

Main dashboard screen displaying:
- Header with app logo and info button
- 4 KPI cards (patients, visits, alerts, messages)
- Patients needing attention (top 3)
- Upcoming visits (top 3)

**Features**:
- Responsive design (mobile and tablet layouts)
- Handedness support (left/right-aligned buttons)
- Tap to navigate to detailed views
- Formatted dates and patient information

**Navigation**:
- Tap KPI cards or "View All" buttons to navigate to filtered patient views
- Tap message card to navigate to messages screen

### 5. Dashboard Components

#### StatCard (`src/screens/components/StatCard.js`)
Displays a KPI metric with icon, value, and label.

```javascript
<StatCard
  icon="👥"
  value={15}
  label="Active Patients"
  onPress={() => handleTap()}
  testID="kpi_patients"
/>
```

#### PatientRow (`src/screens/components/PatientRow.js`)
Displays a patient in a list with optional priority tag.

```javascript
<PatientRow
  name="Sarah Johnson"
  subtitle="Priority: Critical"
  tag="CRITICAL"
  color="#DC2626"
/>
```

#### SectionHeader (`src/screens/components/SectionHeader.js`)
Displays a section title.

```javascript
<SectionHeader title="Patients Needing Attention" />
```

### 6. Utility Functions

#### dtFormat.js

Date formatting utilities:
- `formatDtYmdHmm(date)` - Format as `YYYY-MM-DD HH:MM`
- `formatDtMmmDdYyyyHmm(date)` - Format as `MMM DD, YYYY HH:MM`

## Usage

### Using Dashboard Data

```javascript
import { useDashboard } from './src/contexts/DashboardContext';

export default function MyScreen() {
  const { totalPatients, needingAttention } = useDashboard();

  return (
    <View>
      <Text>Total Patients: {totalPatients}</Text>
      {needingAttention.map(patient => (
        <Text key={patient.fullName}>{patient.fullName}</Text>
      ))}
    </View>
  );
}
```

### Accessing Patient Repository

```javascript
import { useDashboard } from './src/contexts/DashboardContext';

export default function MyScreen({ viewMode }) {
  const { patientsRepository } = useDashboard();

  let patients;
  if (viewMode === 'needingAttention') {
    patients = patientsRepository.needingAttentionSorted();
  } else if (viewMode === 'upcomingVisits') {
    patients = patientsRepository.upcomingVisitsSorted();
  } else {
    patients = patientsRepository.allPatients();
  }

  return (
    // Render patients...
  );
}
```

## Responsive Design

### Tablet Layout (width >= 600px)
- Max width: 1100px, centered
- KPI grid: 4 columns
- Sections displayed side-by-side

### Mobile Layout (width < 600px)
- Full width with padding
- KPI grid: 2 columns
- Sections stacked vertically

## Styling System

### Colors
- Primary: `#0A7A8A` (teal) - Buttons, links, highlights
- Background: `#F7FAFB` (light gray) - Screen background
- Surface: `#FFFFFF` (white) - Cards, containers
- Text: `#333333` (dark gray) - Primary text
- Text Secondary: `#999999` (medium gray) - Secondary text

### Criticality Colors
- CRITICAL: `#DC2626` (red)
- HIGH: `#EA580C` (orange)
- MEDIUM: `#60A5FA` (blue)
- LOW: `#10B981` (green)

### Spacing
- Small (xs): 4px
- Small (sm): 8px
- Medium: 12px
- Large (lg): 16px
- Extra Large (xl): 24px

## Accessibility Features

- Test IDs on all interactive elements
- Semantic labels on buttons
- Proper text contrast ratios
- Touch targets >= 44x44dp
- Handedness support (left/right layouts)

## Test IDs

Dashboard component test IDs for automated testing:
- `kpi_patients` - Active Patients card
- `kpi_visits` - Upcoming Visits card
- `kpi_attention` - Patients Needing Attention card
- `kpi_messages` - Messages card

## Sample Data

The dashboard includes 16 sample patients:
- 6 with both criticality and upcoming visits
- 4 with criticality only (needing attention)
- 6 with upcoming visits only

And 6 sample messages:
- 3 unread messages
- 3 read messages

## Integration with App Navigation

The dashboard is integrated as the initial screen when authenticated:

```javascript
// In App.js
<Stack.Navigator initialRouteName="Dashboard">
  <Stack.Screen name="Dashboard" component={CaregiverDashboardScreen} />
  <Stack.Screen name="Patients" component={PatientsScreen} />
  <Stack.Screen name="Messages" component={MessagesScreen} />
  {/* ... other screens */}
</Stack.Navigator>
```

## Navigation Actions

Dashboard supports navigation to:

1. **Patient Views** (via KPI cards or "View All" buttons)
   - `Patients` screen with `viewMode` parameter
   - View modes: `all`, `needingAttention`, `upcomingVisits`

2. **Messages Screen** (via Messages KPI card)
   - `Messages` screen with `viewMode` parameter
   - View modes: `unread`, `all`

3. **Change Password** (via Profile menu)
   - Navigate to `ChangePassword` screen

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live updates
   - Refresh animations
   - Badge updates

2. **Search and Filtering**
   - Search patients by name
   - Filter by criticality
   - Filter by upcoming visit date range

3. **Charts and Analytics**
   - Patient health trends
   - Visit schedules
   - Message trends

4. **Action Buttons**
   - Quick call/message actions
   - Create new appointment
   - Update patient status

5. **Notifications**
   - Push notifications for critical alerts
   - Message notifications
   - Appointment reminders

## Comparison with Flutter Implementation

| Feature | Flutter | React Native |
|---------|---------|--------------|
| Layout Engine | Flutter layout | React Native flex |
| Sorting Logic | Dart | JavaScript |
| State Management | Provider | React Context |
| Components | StatelessWidget | Functional |
| Responsiveness | LayoutBuilder | Dimensions + useMemo |
| Date Formatting | Custom formatter | JavaScript Date API |

## Notes

- Sample data is generated locally in repositories
- No backend API calls in current implementation
- All sorting done in-memory on app initialization
- Dashboard data is static throughout the session
- For production, integrate with real patient data service
