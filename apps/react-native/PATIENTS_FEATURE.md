# Patients Feature Documentation

## Overview
The Patients feature displays a list of patients with filtering capabilities. Users can view patients in three different modes:
- **All Patients**: Shows all patients with their criticality level and next appointment
- **Needing Attention**: Displays patients with criticality levels (Critical, High, Medium, Low) sorted by urgency
- **Upcoming Visits**: Shows patients with upcoming appointments sorted by visit date

## Equivalent Flutter Code
- **Flutter File**: `apps/flutter/lib/features/patients/patients_list_screen.dart`
- **Flutter Models**: `apps/flutter/lib/core/models/patient.dart`

## React Native Implementation

### File Structure
```
src/
├── contexts/
│   └── PatientsContext.js              # State management and filtering logic
├── screens/
│   ├── PatientsListScreen.js           # Main patients list screen
│   └── components/
│       ├── PatientCardComponents.js    # All three card component types
│       └── PatientFilterMenu.js        # Filter modal for view mode selection
├── repositories/
│   └── PatientsRepository.js           # Patient data and sorting methods
├── models/
│   └── Patient.js                      # Patient class and criticality enum
└── utils/
    └── dtFormat.js                     # Date formatting utilities
```

### Data Models

#### PatientCriticality Enum
```javascript
export const PatientCriticality = {
  CRITICAL: 'critical',    // Red (#D32F2F)
  HIGH: 'high',           // Orange (#F57C00)
  MEDIUM: 'medium',       // Blue-grey (#455A64)
  LOW: 'low',             // Green (#388E3C)
};
```

#### Patient Class
```javascript
export class Patient {
  constructor(firstName, lastName, criticality = null, nextVisit = null) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.criticality = criticality;      // PatientCriticality enum value
    this.nextVisit = nextVisit;          // Date object or null
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

### State Management (Context)

#### PatientsContext
Provides patient data and filtering functionality using React Context API.

**Exports:**
- `PatientViewMode`: Enum with ALL, UPCOMING_VISITS, NEEDING_ATTENTION
- `PatientsProvider`: Context provider component
- `usePatients()`: Hook to access patients data and filtering

**Hook Return Value:**
```javascript
{
  viewMode,              // Current filter mode (PatientViewMode)
  setViewMode,           // Function to change view mode
  patients,              // Filtered and sorted patient array
}
```

**Example Usage:**
```javascript
const { viewMode, setViewMode, patients } = usePatients();

// Switch to "needing attention" view
setViewMode(PatientViewMode.NEEDING_ATTENTION);
```

### Screens

#### PatientsListScreen
Main screen displaying the filtered patient list with header and filter button.

**Props:**
- `navigation`: React Navigation navigation object

**Key Features:**
- Dynamic title based on current view mode
- Filter button to open filter modal
- Three different card components based on view mode
- Empty state when no patients match the filter
- Test IDs for automation testing

**View Modes & Display:**

1. **All Patients** (Default)
   - Card Type: `PatientCard`
   - Shows: Name, Criticality level (text), Next appointment, Criticality tag
   - Sorted: By name

2. **Needing Attention**
   - Card Type: `PriorityPatientCard`
   - Shows: Name, Next visit info, Criticality tag
   - Sorted: By criticality level (Critical → High → Medium → Low), then by visit date

3. **Upcoming Visits**
   - Card Type: `VisitPatientCard`
   - Shows: Name, Visit date/time, Criticality tag
   - Sorted: By visit date (earliest first)

### Components

#### PatientCardComponents.js
Contains three different card component types:

##### 1. PriorityPatientCard (Needing Attention)
Used in "Needing Attention" view mode. Emphasizes criticality.
```javascript
<PriorityPatientCard 
  patient={patient}
  index={index}
  onPress={() => handlePress(patient)}
/>
```

**Display:**
- Patient name (bold, 16pt)
- Next visit information or "No upcoming visit"
- Criticality tag (color-coded)

##### 2. VisitPatientCard (Upcoming Visits)
Used in "Upcoming Visits" view mode. Emphasizes visit appointment.
```javascript
<VisitPatientCard 
  patient={patient}
  index={index}
  onPress={() => handlePress(patient)}
/>
```

**Display:**
- Patient name (bold, 16pt)
- Visit date and time
- Criticality tag (color-coded)

##### 3. PatientCard (All Patients)
Used in "All Patients" view mode. Shows full information.
```javascript
<PatientCard 
  patient={patient}
  index={index}
  onPress={() => handlePress(patient)}
/>
```

**Display:**
- Patient name (bold, 16pt)
- Criticality level (text: "Critical", "High", "Medium", "Low", or "—")
- Next appointment info or "No upcoming visit"
- Criticality tag (color-coded)

**Common Features (All Cards):**
- Horizontal layout with information on left, tag on right
- Touch feedback (activeOpacity)
- Color-coded criticality tags:
  - CRITICAL: Red text on light red background
  - HIGH: Orange text on light orange background
  - MEDIUM: Blue-grey text on light blue-grey background
  - LOW: Green text on light green background
- Test IDs: `patient_card_{index}`, `patient_tag_{index}`

#### PatientFilterMenu.js
Bottom sheet modal for selecting view mode.

**Props:**
- `visible`: Boolean to show/hide modal
- `onClose`: Callback when modal closes
- `viewMode`: Current active view mode
- `onViewModeChange`: Callback when view mode changes

**Features:**
- Three filter options with radio buttons
- Selection indicator (filled dot for selected option)
- Close button at bottom
- Smooth animations
- Test IDs: `filter_option_{viewMode}`, `filter_close_button`

### Repositories

#### PatientsRepository
Manages patient data and provides sorting/filtering methods.

**Methods:**

```javascript
// Get all patients unfiltered
allPatients(): Patient[]

// Get patients needing attention, sorted by criticality
needingAttentionSorted(): Patient[]

// Get patients with upcoming visits, sorted by date
upcomingVisitsSorted(): Patient[]
```

**Sorting Logic:**

1. **Needing Attention:**
   - By criticality level (Critical → High → Medium → Low)
   - Then by next visit date (earliest first)
   - Then by last name, then first name

2. **Upcoming Visits:**
   - By visit date (earliest first)
   - Then by last name, then first name

### Integration with App.js

The patients feature is integrated into the navigation stack:

```javascript
// 1. Import PatientsProvider and PatientsListScreen
import { PatientsProvider } from './src/contexts/PatientsContext';
import PatientsListScreen from './src/screens/PatientsListScreen';

// 2. Add to AppStack
<Stack.Screen 
  name="Patients" 
  component={PatientsListScreen}
  options={{ animationEnabled: true }}
/>

// 3. Wrap app with PatientsProvider
<AppProviders>
  <DashboardProvider>
    <MessagesProvider>
      <PatientsProvider>
        <RootNavigator />
      </PatientsProvider>
    </MessagesProvider>
  </DashboardProvider>
</AppProviders>
```

### Navigation
Navigate to Patients screen:
```javascript
navigation.navigate('Patients');
```

### Sample Data
The PatientsRepository includes 16 sample patients:
- 6 with both criticality and upcoming visits (overlap)
- 4 with only criticality levels (needing attention only)
- 6 with only upcoming visits (no criticality)

**Categories:**
- 2 CRITICAL, 2 HIGH, 2 MEDIUM, 2 LOW with appointments
- 1 CRITICAL, 1 HIGH, 1 MEDIUM, 1 LOW without appointments
- 6 patients with only appointments, no criticality

## Styling

### Color Palette
- Primary: `#0A7A8A` (teal)
- Background: `#F7FAFB` (light off-white)
- Card Background: `#FFFFFF` (white)
- Border: `#E8E8E8` (light grey)
- Text: `#000000` (black), `#999999` (grey)

### Criticality Colors
- CRITICAL: `#D32F2F` (red)
- HIGH: `#F57C00` (orange)
- MEDIUM: `#455A64` (blue-grey)
- LOW: `#388E3C` (green)

### Spacing & Typography
- Header Title: 20pt, bold
- Card Name: 16pt, bold
- Card Subtitle: 13-15pt, grey
- Tags: 12pt, bold
- Standard padding: 16px horizontal
- Card margins: 12px bottom

## Accessibility & Testing

### Test IDs
- Screen: `patients_list`, `patients_filter_button`
- Cards: `patient_card_{index}`, `patient_tag_{index}`
- Filter: `filter_option_{viewMode}`, `filter_close_button`

### Accessibility Features
- Touch targets minimum 44x44pt
- Color-coded criticality levels (not relying on color alone)
- Clear text labels in filter options
- Semantic component usage (TouchableOpacity for buttons)

## Future Enhancements
- Patient detail screen with full medical history
- Search functionality within patients list
- Patient notes or care plan information
- Real-time patient status updates
- Integration with patient messaging
- Patient profile navigation from dashboard
