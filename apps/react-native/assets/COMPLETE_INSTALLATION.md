# 🚀 Complete CareConnect Installation with Bottom Navigation

## 📁 Files Location
All files are in: `/Users/james_stevens/Desktop/react`

---

## ⚡ Quick Install (Copy & Paste All At Once)

```bash
# Navigate to project
cd /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native

# Create folders
mkdir -p src/data
mkdir -p src/navigation

# Copy assets
cp -r /Users/james_stevens/Desktop/assets ./

# Copy data files
cp /Users/james_stevens/Desktop/react/PatientsRepository.js src/data/
cp /Users/james_stevens/Desktop/react/MessagesRepository.js src/data/

# Copy navigation
cp /Users/james_stevens/Desktop/react/MainTabNavigator.js src/navigation/

# Backup and replace screens
mv src/screens/WelcomeScreen.js src/screens/WelcomeScreen.js.backup
cp /Users/james_stevens/Desktop/react/WelcomeScreen-new.js src/screens/WelcomeScreen.js
cp /Users/james_stevens/Desktop/react/LoginScreen.js src/screens/
cp /Users/james_stevens/Desktop/react/CaregiverDashboardScreen.js src/screens/
cp /Users/james_stevens/Desktop/react/MessagesScreen.js src/screens/
cp /Users/james_stevens/Desktop/react/SettingsScreen.js src/screens/

# Backup and update App.js
cp App.js App.js.backup
cp /Users/james_stevens/Desktop/react/App-final.js App.js

# Update package.json
cp package.json package.json.backup
cp /Users/james_stevens/Desktop/react/package-updated.json package.json

# Install new dependency (bottom tabs)
npm install @react-navigation/bottom-tabs

# Done! Now run the app
ulimit -n 200000
ulimit -u 2048
npm start
```

---

## 📱 What You Get

### ✅ Complete Navigation Flow
1. **Welcome Screen** → Carousel with logo
2. **Login Screen** → Email/password
3. **Main App** with bottom tabs:
   - 🏠 **Home** → Dashboard (4 KPI tiles, patient lists)
   - 👥 **Patients** → Patient list (existing)
   - ✓ **Tasks** → Task list (existing)
   - 💬 **Messages** → Message inbox (NEW)
   - ⚙️ **Settings** → App settings (NEW)

### ✅ Bottom Navigation Bar
- Always visible on main screens
- Active tab highlighted
- Badge on Messages tab showing unread count
- Icons for each tab

---

## 🖼️ Assets Included

### Carousel Images
- `/assets/carousel/` → Your caregiver images (auto-rotating)

### Logo
- `/assets/logo/` → CareConnect logo

---

## 📊 File Structure After Installation

```
react-native/
├── App.js (updated with tab navigation)
├── package.json (updated with bottom tabs)
├── assets/
│   ├── carousel/ (your images)
│   └── logo/ (your logo)
├── src/
│   ├── data/
│   │   ├── PatientsRepository.js
│   │   └── MessagesRepository.js
│   ├── navigation/
│   │   └── MainTabNavigator.js
│   ├── screens/
│   │   ├── WelcomeScreen.js (updated)
│   │   ├── LoginScreen.js (new)
│   │   ├── CaregiverDashboardScreen.js (new)
│   │   ├── MessagesScreen.js (new)
│   │   ├── SettingsScreen.js (new)
│   │   ├── PatientsScreen.js (existing)
│   │   ├── TasksScreen.js (existing)
│   │   ├── ScheduleScreen.js (existing)
│   │   └── ProfileScreen.js (existing)
│   └── contexts/
│       └── AppProviders.js (existing)
```

---

## 🎨 Next: Update WelcomeScreen for Local Images

After installation, update `src/screens/WelcomeScreen.js`:

**Find line ~15:**
```javascript
const carouselImages = [
  'https://picsum.photos/800/500?random=1',
  // ... more URLs
];
```

**Replace with:**
```javascript
const carouselImages = [
  require('../../assets/carousel/caregiver_pair_01.jpg'),
  require('../../assets/carousel/caregiver_pair_02.jpg'),
  require('../../assets/carousel/caregiver_pair_03.jpg'),
  require('../../assets/carousel/caregiver_pair_04.jpg'),
  require('../../assets/carousel/caregiver_pair_05.jpg'),
  require('../../assets/carousel/caregiver_pair_06.jpg'),
  require('../../assets/carousel/caregiver_pair_07.jpg'),
  require('../../assets/carousel/caregiver_pair_08.jpg'),
  require('../../assets/carousel/caregiver_pair_09.jpg'),
  require('../../assets/carousel/caregiver_pair_10.jpg'),
];
```

**And change line ~102** from:
```javascript
source={{ uri }}
```
to:
```javascript
source={uri}
```

---

## 🎯 Testing Checklist

After installation, test this flow:

1. ✅ App opens to Welcome screen with carousel
2. ✅ Carousel auto-rotates every 4 seconds
3. ✅ Click "Continue" → Goes to Login
4. ✅ Enter any email/password → Goes to Dashboard
5. ✅ Bottom nav bar visible with 5 tabs
6. ✅ Click each tab:
   - Home → Dashboard
   - Patients → Patient list
   - Tasks → Task list
   - Messages → Message inbox
   - Settings → Settings screen
7. ✅ Messages tab shows badge (3)
8. ✅ Click KPI tiles on dashboard
9. ✅ Left/right-handed toggle works in Settings

---

## 🔧 Troubleshooting

### "Cannot find module '@react-navigation/bottom-tabs'"
```bash
npm install @react-navigation/bottom-tabs
```

### Images not loading
- Verify assets folder exists: `ls assets/carousel`
- Make sure WelcomeScreen uses `require()` not URLs

### Navigation error
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start -- --reset-cache
```

---

## 🎉 You're Done!

Run the quick install commands above and you'll have a complete CareConnect React Native app with bottom navigation!
