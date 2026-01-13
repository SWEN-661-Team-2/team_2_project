# CareConnect

Left-handed Care Givers — Accessible UI for Clinical Workflows

CareConnect is a cross-platform user interface project focused on designing workflows optimized for left-handed caregivers, where traditional UI systems implicitly assume right-handed interaction. The goal is to reduce friction in documentation, scheduling, task execution, and navigation.

---

## Team Members

- Corey Bayliss  
- James Stevens
-  

---

## Team Charter

See the full charter here:  
./docs/TEAM-CHARTER.md

---

## Project Goals

CareConnect aims to:

1. Design UI layouts that support left-handed ergonomics without excluding right-handed users.
2. Improve workflow efficiency for left-handed caregivers in common digital tasks.
3. Apply human-centered design processes including research, prototyping, and usability testing.
4. Deliver a functional prototype for academic evaluation.
5. Produce supporting documentation detailing research, design rationale, and testing.

---

## Project Scope

In Scope:
- UI/UX design research
- Prototypes, wireframes, and visual components
- Front-end or prototype implementation
- Usability testing and documentation

Out of Scope:
- Backend development and databases
- HIPAA/PHI compliance or real patient data
- Production deployment or distribution

---

## Repository Structure

This repository supports multiple UI technology stacks:

```
.
├── apps/
│   ├── flutter/         # Flutter implementation (mobile)
│   ├── react-native/    # React Native implementation (mobile)
│   ├── electron/        # Electron implementation (desktop)
│   └── react/           # React (web) implementation
├── docs/                # Team charter, research docs, etc.
├── .gitignore           # Common ignores for all stacks
└── README.md
```

Each folder under `apps/` will eventually contain a functioning prototype representing the CareConnect concept.

---

## Tech Stacks

This project may involve:

- Flutter (mobile)
- React Native (mobile)
- Electron (desktop)
- React (web)

Note: Only UI and workflow layers are part of project scope.

---

## Setup Instructions (to be updated)

These instructions will evolve as stacks are initialized.

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/CareConnect.git
cd CareConnect
```

### 2. Create initial folders (if needed)

```bash
mkdir -p apps/flutter apps/react-native apps/electron apps/react
mkdir -p docs
```

### 3. Running each implementation (pending initialization)

React (Web):
```bash
cd apps/react
# npm install
# npm start
```

React Native (Mobile):
```bash
cd apps/react-native
# npm install
# npx react-native start
```

Electron (Desktop):
```bash
cd apps/electron
# npm install
# npm run electron-dev
```

Flutter (Mobile):
```bash
cd apps/flutter
# flutter pub get
# flutter run
```

---

## .gitignore

The repository includes a `.gitignore` compatible with:
- Flutter
- React Native
- Electron
- React
- Node-based build systems
- IDE/editor artifacts

This ensures clean commits and consistent development environments.

---

## Development Workflow

The team follows a structured workflow based on the charter:

- Weekly check-ins
- Git branching and pull request reviews
- Platform-specific development in `apps/`
- Research and testing documentation in `docs/`

---

## Definition of Done

A task is considered “done” when:

- Requirements are met
- Design or code is reviewed by a teammate
- Errors are resolved
- Documentation is updated if applicable

---

## Licensing / Notes

This project is for academic purposes as part of SWEN 661 — User Interface Implementation at UMGC.

---

End of README

